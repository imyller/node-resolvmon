"use strict";

var fs = require('fs'),
	path = require('path'),
	dns = require('dns'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var _DEFAULT_RESOLVCONF = '/etc/resolv.conf';

function watchFile(filepath, callback) {

	var fpath = path.resolve(filepath),
		fdir = path.dirname(fpath),
		fname = path.basename(fpath);

	fs.statSync(fdir);

	return fs.watch(fdir, {persistent: false, recursive: false}, function (event, changed_fname) {

		if (changed_fname === fname) {

			fs.stat(fpath, function (err, stats) {
				callback && callback(null, !err, fpath);
			});

		}

	});

}

function parseResolvConf(filepath, callback) {

	fs.readFile(filepath, {encoding: 'utf8', flag: 'r'}, function (err, data) {

		if (err) {
			callback && callback(err);
			return;
		}

		var lines = data.split('\n');

		var nameservers = [], ns;

		lines.forEach(function (line) {
			var fields = line.split(/\s+/);
			if (fields.length && fields[0].toLowerCase() === 'nameserver') {
				ns = fields[1];
				if (ns) {
					ns = ns.trim();
					if (ns.length) {
						nameservers.push(ns);
					}
				}
			}
		});
		callback && callback(null, nameservers);

	});

}

var ResolvMon = function () {
	var self = this;
	self._resolvconf = _DEFAULT_RESOLVCONF;
	self._watcher = undefined;
};

util.inherits(ResolvMon, EventEmitter);

ResolvMon.prototype._emit = function (event, value) {
	this.emit('any', event, value);
	this.emit(event, value);
};

ResolvMon.prototype._setServers = function (nameservers, callback) {

	var self = this;

	try {

		dns.setServers(nameservers);

		var newServers = dns.getServers();

		self._emit('update', newServers);

		if (callback) process.nextTick(function () {
			callback(null, newServers);
		});

	} catch (ex) {
		self._emit('error', ex);
		callback && callback(ex, []);
	}

};

ResolvMon.prototype.clear = function (callback) {
	this._setServers([], callback);
	return this;
};

ResolvMon.prototype.update = function (callback) {

	var self = this,
		fpath = path.resolve(self._resolvconf),
		fdir = path.dirname(fpath);

	try {
		fs.statSync(fdir);
	} catch (ex) {
		self._emit('error', ex);
		if (callback) callback(ex, []); else throw ex;
		return;
	}

	try {

		parseResolvConf(fpath, function (err, nameservers) {

			if (err) {
				self._setServers([], callback);
				return;
			}

			try {
				self._setServers(nameservers, callback);
			} catch (ex) {
			}

		});

		return self;

	} catch (ex) {
		self._emit('error', ex);
		if (callback) callback(ex, []); else throw ex;
	}

};

ResolvMon.prototype.start = function (callback) {

	var self = this;

	if (self._watcher) {
		callback && callback();
		return;
	}

	try {

		self._watcher = watchFile(self._resolvconf, function (err, exists) {

			if (err) {
				self._emit('error', err);
				return;
			}

			try {

				if (exists) {
					self.update();
				} else {
					self.clear();
				}

			} catch (ex) {
			}

		});

		self._emit('start');

		if (callback) {
			process.nextTick(function () {
				callback();
			});
		}

		return self;

	} catch (ex) {
		self._emit('error', ex);
		if (callback) callback(ex); else throw ex;
	}

};

ResolvMon.prototype.stop = function (callback) {

	var self = this;

	try {

		if (self._watcher) {
			self._watcher.close();
			self._watcher = undefined;
		}

		self._emit('stop');

		if (callback) process.nextTick(function () {
			callback();
		});

		return self;

	} catch (ex) {
		self._emit('error', ex);
		if (callback) callback(ex); else throw ex;
	}

};

ResolvMon.prototype.getPath = function () {
	return this._resolvconf;
};

ResolvMon.prototype.setPath = function (resolvconf) {

	var self = this;

	if (!resolvconf) {
		resolvconf = _DEFAULT_RESOLVCONF;
	}

	self._resolvconf = resolvconf;

	if (this._watcher) {
		self.stop();
		self.start();
	}

	return self;

};

module.exports = new ResolvMon();