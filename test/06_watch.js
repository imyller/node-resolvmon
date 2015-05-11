"use strict";

var path = require('path'),
	fs = require('fs'),
	temp = require('temp'),
	chai = require('chai'),
	expect = chai.expect;

var EventEmitter = require('events').EventEmitter;

describe('resolvmon watch', function () {

	var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));

	temp.track();

	var temporary_conf = temp.openSync('resolv.conf').path;

	before(function (done) {

		try {
			fs.unlink(temporary_conf, done);
		} catch (ex) {
			done();
		}

	});

	afterEach(function (done) {

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

		try {
			fs.unlink(temporary_conf, function (err) {
				done();
			});
		} catch (ex) {
			done();
		}

	});

	it('detect resolv.conf create', function (done) {

		fs.unlink(temporary_conf, function (err) {

			expect(err).not.to.be.defined;

			if (err) {
				return done();
			}

			resolvmon.setPath(temporary_conf);

			resolvmon.on('error', function (err) {
				expect(err).not.to.be.defined;
				done(err);
			});

			resolvmon.on('update', function (nameservers) {

				expect(nameservers).to.be.defined;
				expect(nameservers).to.be.instanceof(Array);
				expect(nameservers).to.eql(['127.0.0.10', '127.0.0.20']);
				done();
			});

			resolvmon.start();

			process.nextTick(function () {
				fs.writeFileSync(temporary_conf, "nameserver 127.0.0.10\nnameserver 127.0.0.20\n");
			});

		});

	});

	it('detect resolv.conf delete', function (done) {

		resolvmon.setPath(temporary_conf);

		fs.writeFile(temporary_conf, "nameserver 127.0.0.11\nnameserver 127.0.0.22\n", function (err) {

			expect(err).not.to.be.defined;

			if (err) {
				return done();
			}

			resolvmon.on('error', function (err) {
				resolvmon.removeAllListeners();
				expect(err).not.to.be.defined;
				done(err);
			});

			resolvmon.on('update', function (nameservers) {
				resolvmon.removeAllListeners();
				expect(nameservers).to.be.defined;
				expect(nameservers).to.be.instanceof(Array);
				expect(nameservers).to.eql([]);
				done();

			});

			resolvmon.start();

			process.nextTick(function () {
				fs.unlinkSync(temporary_conf);
			});

		});

	});

	it('detect resolv.conf append', function (done) {

		resolvmon.setPath(temporary_conf);

		fs.writeFile(temporary_conf, "nameserver 127.0.0.12\nnameserver 127.0.0.23", function (err) {

			expect(err).not.to.be.defined;

			if (err) {
				return done();
			}

			resolvmon.on('error', function (err) {
				resolvmon.removeAllListeners();
				expect(err).not.to.be.defined;
				done(err);
			});

			resolvmon.on('update', function (nameservers) {
				resolvmon.removeAllListeners();
				expect(nameservers).to.be.defined;
				expect(nameservers).to.be.instanceof(Array);
				expect(nameservers).to.eql(['127.0.0.12', '127.0.0.23', '127.0.0.34', '127.0.0.45']);
				done();
			});

			resolvmon.start();

			process.nextTick(function () {
				fs.appendFileSync(temporary_conf, "\nnameserver 127.0.0.34\nnameserver 127.0.0.45\n");
			});


		});

	});

	it('detect resolv.conf modification', function (done) {

		resolvmon.setPath(temporary_conf);

		fs.writeFile(temporary_conf, "nameserver 127.0.0.77\nnameserver 127.0.0.88\n", function (err) {

			expect(err).not.to.be.defined;

			if (err) {
				return done();
			}

			resolvmon.on('error', function (err) {
				resolvmon.removeAllListeners();
				expect(err).not.to.be.defined;
				done(err);
			});

			resolvmon.on('update', function (nameservers) {
				resolvmon.removeAllListeners();
				expect(nameservers).to.be.defined;
				expect(nameservers).to.be.instanceof(Array);
				expect(nameservers).to.eql(['127.0.0.100', '127.0.0.200']);
				done();
			});

			resolvmon.start();

			process.nextTick(function () {
				fs.writeFileSync(temporary_conf, "nameserver 127.0.0.100\nnameserver 127.0.0.200");
			});

		});

	});

	it('detect resolv.conf rename (from)', function (done) {

		resolvmon.setPath(temporary_conf);

		fs.writeFile(temporary_conf, "nameserver 127.0.0.91\nnameserver 127.0.0.81\n", function (err) {

			expect(err).not.to.be.defined;

			if (err) {
				return done();
			}

			resolvmon.on('error', function (err) {
				resolvmon.removeAllListeners();
				expect(err).not.to.be.defined;
				done(err);
			});

			resolvmon.on('update', function (nameservers) {
				resolvmon.removeAllListeners();
				expect(nameservers).to.be.defined;
				expect(nameservers).to.be.instanceof(Array);
				expect(nameservers).to.eql([]);
				done();
			});

			resolvmon.start();

			process.nextTick(function () {
				fs.renameSync(temporary_conf, temporary_conf + '.renamed');
			});

		});

		after(function (done) {

			try {
				fs.unlink(temporary_conf + '.renamed', function (err) {
					done();
				});
			} catch (ex) {
				done();
			}

		});

	});

	it('detect resolv.conf rename (to)', function (done) {

		resolvmon.setPath(temporary_conf);

		fs.writeFileSync(temporary_conf + '.renamed', "nameserver 127.0.0.51\nnameserver 127.0.0.61\n");

		resolvmon.on('error', function (err) {
			resolvmon.removeAllListeners();
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {
			resolvmon.removeAllListeners();
			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql(['127.0.0.51', '127.0.0.61']);
			done();
		});

		resolvmon.start();

		process.nextTick(function () {
			fs.renameSync(temporary_conf + '.renamed', temporary_conf);
		});

		after(function (done) {

			try {
				fs.unlink(temporary_conf + '.renamed', function (err) {
					done();
				});
			} catch (ex) {
				done();
			}

		});

	});


});