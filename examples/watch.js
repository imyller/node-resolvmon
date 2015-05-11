"use strict";

var util = require('util'),
	resolvmon = require('../lib/resolvmon.js');

resolvmon.setPath(__dirname + '/resolv.conf');

// Notify errors

resolvmon.on('error', function (err) {
	console.error(util.format('[error] %s', err));
});

// Notify changes

resolvmon.on('update', function (nameservers) {
	console.log(util.format('[update] %s', JSON.stringify(nameservers)));
});

// Trigger manual update

resolvmon.update();

// Start resolvmon

resolvmon.start();

// Wait for console key press

console.log('Watching resolv.conf - press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));