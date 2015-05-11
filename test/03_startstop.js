"use strict";

var path = require('path'),
	chai = require('chai'),
	expect = chai.expect;

describe('resolvmon function', function () {


	describe('start()', function () {

		var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));
		var fpath = path.join(__dirname, 'files', 'resolv_valid.conf');

		it('should exist', function (done) {

			expect(resolvmon.start).to.exist;
			expect(resolvmon.start).to.be.a.function;
			done();
		});

		it('should be chainable', function (done) {

			resolvmon.setPath(fpath);
			var result = resolvmon.start();
			resolvmon.stop();
			expect(result).to.equal(resolvmon);
			done();

		});

		it('should work without a callback', function (done) {

			resolvmon.setPath(fpath);
			var fn = function () {
				resolvmon.start();
			};
			expect(fn).not.to.throw();
			done();

		});

		it('should do a callback', function (done) {

			resolvmon.setPath(fpath);
			resolvmon.start(function (err) {

				expect(err).not.to.be.defined;
				done();

			});

		});

		it('should do a callback if called twice', function (done) {

			resolvmon.setPath(fpath);
			resolvmon.start(function (err) {

				expect(err).not.to.be.defined;

				resolvmon.start(function (err) {

					expect(err).not.to.be.defined;

					done();

				});
			});

		});


		it('should throw error with invalid resolv.conf path', function (done) {

			resolvmon.setPath('/this/is/nonexistent/path/to/resolv.conf');
			var fn = function () {
				resolvmon.start();
			};
			expect(fn).to.throw(Error, /ENOENT/);
			done();

		});

		it('should do a callback with invalid resolv.conf path', function (done) {

			resolvmon.setPath('/this/is/nonexistent/path/to/resolv.conf');

			resolvmon.on('error', function () {
			});

			var fn2 = function () {

				resolvmon.start(function (err) {

					expect(err).to.be.defined;
					expect(err).to.match(/ENOENT/);
					done();

				});

			};

			expect(fn2).not.to.throw();

		});

		it('should emit an error with invalid resolv.conf path', function (done) {

			resolvmon.setPath('/this/is/nonexistent/path/to/resolv.conf');

			resolvmon.on('error', function (err) {

				expect(err).to.be.defined;
				expect(err).to.match(/ENOENT/);
				done();


			});

			var fn3 = function () {
				resolvmon.start();
			};

			expect(fn3).to.throw(Error);

		});


		afterEach(function () {

			try {
				resolvmon.removeAllListeners();
			} catch (ex) {
			}

			try {
				resolvmon.stop();
			} catch (ex) {
			}


			try {
				resolvmon.setPath(undefined);
			} catch (ex) {
			}


		});


	});

	describe('stop()', function () {

		var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));

		it('should exist', function (done) {
			expect(resolvmon.stop).to.exist;
			expect(resolvmon.stop).to.be.a.function;
			done();
		});

		it('should be chainable', function (done) {

			var result = resolvmon.stop();
			expect(result).to.equal(resolvmon);
			done();

		});

		it('should do a callback', function (done) {

			resolvmon.stop(function (err) {

				expect(err).not.to.be.defined;
				done();

			});

		});

		it('should do a callback if called twice', function (done) {

			resolvmon.stop(function (err) {

				expect(err).not.to.be.defined;

				resolvmon.stop(function (err) {

					expect(err).not.to.be.defined;

					done();

				});
			});

		});

		afterEach(function () {

			try {
				resolvmon.removeAllListeners();
			} catch (ex) {
			}

			try {
				resolvmon.stop();
			} catch (ex) {
			}


			try {
				resolvmon.setPath(undefined);
			} catch (ex) {
			}


		});


	});

});