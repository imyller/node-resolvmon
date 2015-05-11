"use strict";

var path = require('path'),
	chai = require('chai'),
	expect = chai.expect;

var EventEmitter = require('events').EventEmitter;

describe('resolvmon', function () {

	var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));

	it('module should load', function (done) {
		expect(resolvmon).to.exist;
		expect(resolvmon).not.to.be.undefined;
		expect(resolvmon).not.to.be.null;
		done();
	});

	it('instance should be an event emitter', function (done) {
		expect(resolvmon).to.be.an.instanceof(EventEmitter);
		done();
	});

});