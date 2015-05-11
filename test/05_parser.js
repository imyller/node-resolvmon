"use strict";

var path = require('path'),
	chai = require('chai'),
	expect = chai.expect,
	dns = require('dns');

describe('resolvmon parser', function () {

	var resolvmon = require(path.join(__dirname, '../lib/resolvmon.js'));

	var missing_conf = path.join(__dirname, 'files', 'resolv_non_existing.conf'),
		valid_conf = path.join(__dirname, 'files', 'resolv_valid.conf'),
		invalid_ip_conf = path.join(__dirname, 'files', 'resolv_invalid_ip.conf'),
		empty_conf = path.join(__dirname, 'files', 'resolv_empty.conf'),
		no_nameservers_conf = path.join(__dirname, 'files', 'resolv_no_nameservers.conf'),
		comments_conf = path.join(__dirname, 'files', 'resolv_comments.conf');

	it('should accept valid resolv.conf', function (done) {

		resolvmon.setPath(valid_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql(['127.0.0.1', '127.0.0.2']);
			done();
		});

		resolvmon.update();

	});


	it('should accept resolv.conf with comments', function (done) {

		resolvmon.setPath(comments_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql(['127.0.0.4', '127.0.0.5']);
			done();
		});

		resolvmon.update();

	});

	it('should accept empty resolv.conf', function (done) {

		resolvmon.setPath(empty_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql([]);
			done();
		});

		resolvmon.update();

	});

	it('should accept resolv.conf without any nameservers', function (done) {

		resolvmon.setPath(no_nameservers_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql([]);
			done();
		});

		resolvmon.update();

	});

	it('should accept resolv.conf that does not yet exist', function (done) {

		resolvmon.setPath(missing_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql([]);
			done();
		});

		resolvmon.update();

	});

	it('should fail with invalid IPs in resolv.conf', function (done) {

		resolvmon.setPath(invalid_ip_conf);

		resolvmon.on('error', function (err) {
			expect(err).to.be.defined;
			expect(err).to.match(/not properly formatted/);
			done();
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).not.to.be.defined;
			done(new Error('unexpected update event emitted'));
		});

		resolvmon.update();

	});

	it('should actually update DNS server configuration', function (done) {

		resolvmon.setPath(valid_conf);

		resolvmon.on('error', function (err) {
			expect(err).not.to.be.defined;
			done(err);
		});

		resolvmon.on('update', function (nameservers) {

			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql(['127.0.0.1', '127.0.0.2']);
		});

		resolvmon.update(function (err, nameservers) {

			expect(err).not.to.be.defined;
			expect(nameservers).to.be.defined;
			expect(nameservers).to.be.instanceof(Array);
			expect(nameservers).to.eql(['127.0.0.1', '127.0.0.2']);
			expect(dns.getServers()).to.eql(['127.0.0.1', '127.0.0.2']);

			done();

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
