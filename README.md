# sator_square
Writes valid sator squares to a file given a word

Simply clone this and run with Node v6+
The command to run would be:
```
node --harmony sator WORD
```

A file named "WORD.txt" would be created, and sator squares containing WORD will be saved inside should they exist.

The `--harmony` option is used so that tail recursion optimization of Node is used. Otherwise, the stack size limit may be exceeded.
