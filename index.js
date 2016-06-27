#!/usr/bin/env node
'use strict';

var repl = require('repl');
var argv = require('minimist')(process.argv.slice(2));
var replHistory = require('repl.history');
var osHomedir = require('os-homedir');
var path = require('path');

var shell;
var json;
var isLocal;
try {
  if (argv.path[0] === '~')
    argv.path = argv.path.replace('~', osHomedir());
  var localShellJS = path.resolve(argv.path);
  shell = require('require-relative')(localShellJS, process.cwd());
  json = require(path.join(localShellJS, 'package.json'));
  isLocal = true;
} catch (e) {
  shell = require('shelljs');
  json = require('shelljs/package.json');
  isLocal = false;
}

// Polyfills for commands that shelljs doesn't have yet
if (!shell.clear) shell.clear = require('clear');

// Create the prompt
var myprompt = argv.prompt || 'shelljs %v%l $ ';
myprompt = myprompt.replace(/%./g, (function() {
  var option = {
    '%%': '%',
    '%v': json.version,
    '%l': (isLocal ? ' [local]' : '')
  };
  return function(match) {
    return option[match];
  };
})());

var replServer = repl.start({
  prompt: myprompt,
  replMode: process.env.NODE_REPL_MODE === 'strict' || argv.use_strict ? repl.REPL_MODE_STRICT : repl.REPL_MODE_MAGIC
});

// save repl history
var HISTORY_FILE = path.join(osHomedir(), '.n_shell_history');
replHistory(replServer, HISTORY_FILE);

function wrap(fun, key) {
  if (typeof fun !== 'function') {
    return fun; // not a function
  } else {
    var outerRet = function() {
      var ret = fun.apply(this, arguments);
      if (ret instanceof Object) {
        // Polyfill .inspect() method
        if (!ret.inspect) ret.inspect = function() {
          if (key === 'echo' || key === 'exec') return '';
          if (key === 'pwd' || key === 'which')
            return this.stdout.match(/\n$/) ? this.stdout : this.stdout + '\n';
          if (this.hasOwnProperty('stdout'))
            return this.stdout;
          else if (Array.isArray(this))
            return this.join('\n');
          else
            return this;
        };
      }
      return ret;
    };
    outerRet.inspect = outerRet.inspect || function () { return this(); };
    return outerRet;
  }
}

argv.no_global = argv.no_global || argv.local || argv.n;

// Add inspect() method, if it doesn't exist
if (!argv.noinspect) {
  for (var key in shell) {
    try {
      shell[key] = wrap(shell[key], key);
    } catch (e) {}
  }
}

if (argv.no_global) {
  if (typeof argv.no_global !== 'string')
    argv.no_global = 'shell';
  replServer.context[argv.no_global] = shell;
} else {
  for (var key in shell) {
    replServer.context[key] = shell[key];
  }
}

module.exports = replServer;
