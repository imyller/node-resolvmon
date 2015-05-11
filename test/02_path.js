"use strict";

var path = require('path'),
	chai = require('chai'),
	expect = chai.expect;

describe('resolvmon function', function () {

	describe('getPath()', function () {

		var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));

		it('should exist', function (done) {
			expect(resolvmon.getPath).to.exist;
			expect(resolvmon.getPath).to.be.a.function;
			done();
		});


		it('should return /etc/resolv.conf by default', function (done) {
			expect(resolvmon.getPath()).to.equal('/etc/resolv.conf');
			done();

		});

	});

	describe('setPath()', function () {

		var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));
		var fpath = path.join(__dirname, 'files', 'resolv_valid.conf');

		it('should exist', function (done) {
			expect(resolvmon.setPath).to.exist;
			expect(resolvmon.setPath).to.be.a.function;
			done();
		});

		it('should be chainable', function (done) {

			var result = resolvmon.setPath(resolvmon.getPath());
			expect(result).to.equal(resolvmon);
			done();

		});

		it('should change the resolv.conf location', function (done) {

			expect(resolvmon.getPath()).not.to.equal(fpath);
			resolvmon.setPath(fpath);
			expect(resolvmon.getPath()).to.equal(fpath);
			done();

		});

		it('should fallback to /etc/resolv.conf with empty parameter', function (done) {

			resolvmon.setPath(fpath);
			resolvmon.setPath();
			expect(resolvmon.getPath()).to.equal('/etc/resolv.conf');
			done();

		});


	});

});