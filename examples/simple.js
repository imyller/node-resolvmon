"use strict";

// This is an example of the basic resolvmon usage:
// require('resolvmon').start() 

require('../lib/resolvmon.js').start();

// Wait for console key press

console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));