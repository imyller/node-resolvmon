"use strict";

var path = require('path'),
	chai = require('chai'),
	expect = chai.expect;

describe('resolvmon function', function () {

	describe('update()', function () {

		var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));
		var fpath = path.join(__dirname, 'files', 'resolv_valid.conf');

		it('should exist', function (done) {

			expect(resolvmon.update).to.exist;
			expect(resolvmon.update).to.be.a.function;
			done();
		});

		it('should be chainable', function (done) {

			resolvmon.setPath(fpath);
			var result = resolvmon.update();
			expect(result).to.equal(resolvmon);
			done();

		});

		it('should work without a callback', function (done) {

			resolvmon.setPath(fpath);
			var fn = function () {
				resolvmon.update();
			};
			expect(fn).not.to.throw();
			done();

		});

		it('should do a callback', function (done) {

			resolvmon.setPath(fpath);
			resolvmon.update(function (err) {

				expect(err).not.to.be.defined;
				done();

			});

		});


		it('should throw error with invalid resolv.conf path', function (done) {

			resolvmon.setPath('/this/is/nonexistent/path/to/resolv.conf');
			var fn = function () {
				resolvmon.update();
			};
			expect(fn).to.throw(Error, /ENOENT/);
			done();

		});

		it('should do a callback with invalid resolv.conf path', function (done) {

			resolvmon.setPath('/this/is/nonexistent/path/to/resolv.conf');

			resolvmon.on('error', function () {
			});

			var fn2 = function () {

				resolvmon.update(function (err) {

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
				resolvmon.update();
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

});