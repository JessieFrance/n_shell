# n_shell

A node REPL with ShellJS loaded by default.

This was inspired by (and forked from) [n\_](https://github.com/borisdiakur/n_).

## Installation:

It's recommended to install this package globally:

```Bash
$ npm install -g github:nfischer/n_shell
```

## Usage:

Invoking `n_shell` starts a node REPL with ShellJS required globally:

```javascript
bash $ n_shell
shelljs $ ls()
[ 'LICENSE',
  'README.md',
  'bin',
  'node_modules',
  'package.json',
  'src',
  'tmp' ]
shelljs $ pwd()
'/path/to/dir'
```

### But I don't want to use `shelljs/global`

No problem:

```javascript
bash $ n_shell --no_global
shelljs $ typeof ls
'undefined'
shelljs $ shell.ls()
[ 'LICENSE',
  'README.md',
  'bin',
  'node_modules',
  'package.json',
  'src',
  'tmp' ]
shelljs $ shell.pwd()
'/path/to/dir'
```

### But I want to use a different namespace

You're covered:

```javascript
bash $ n_shell --no_global=$
shelljs $ $.ls()
[ 'LICENSE',
  'README.md',
  'bin',
  'node_modules',
  'package.json',
  'src',
  'tmp' ]
shelljs $ $.pwd()
'/path/to/dir'
```

### But I want to use a different version of shelljs

Just install that version locally (`npm install shelljs`) and start up
`n_shell`. You should see a warning message like this:

```
bash $ n_shell
Warning: using shelljs found at /path/to/dir/node_modules/shelljs
shelljs $
```
