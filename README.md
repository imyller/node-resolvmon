node-resolvmon
==============
[![Build Status](https://travis-ci.org/imyller/node-resolvmon.svg)](https://travis-ci.org/imyller/node-resolvmon)
[![npm version](https://badge.fury.io/js/resolvmon.svg)](http://badge.fury.io/js/resolvmon)
![io.js supported](https://img.shields.io/badge/io.js-supported-green.svg?style=flat)
![Node.js supported](https://img.shields.io/badge/Node.js-supported-green.svg?style=flat)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=imyller&url=https://github.com/imyller/node-resolvmon&title=node-resolvmon&language=&tags=github&category=software)

[![NPM](https://nodei.co/npm/resolvmon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/resolvmon/)
[![NPM](https://nodei.co/npm-dl/resolvmon.png?months=6&height=3)](https://nodei.co/npm-dl/resolvmon/)

Automatically updates Node DNS resolver configuration if `resolv.conf` changes.

Watches `/etc/resolv.conf` (or similar) for changes and updates Node DNS resolver accordingly.
Detects if `resolv.conf` is created, deleted, renamed or modified.

Why?
----

Current versions of Node.js or io.js do not update their DNS resolver configuration after application has been started.
This is due to DNS client library (`c-ares`) lacking support for reinitialization or monitoring of system setting changes.

If the system DNS resolver is unconfigured at the time of application startup or the configuration is modified afterwards, Node engine does not keep up with the changes.

This module allows monitoring of `/etc/resolv.conf` file and updates the runtime DNS resolver configuration of the Node application without restarting it.

Node Compatibility
---------------------

Supports Node.js v0.12.0+ and io.js v1.0.0+

Node.js version v0.10 or earlier are not supported due to the lack of `dns.setServers()` function.

Please let me know if you have problems running it on a later version of Node or
have platform-specific problems.

Installation
------------

Install `resolvmon` using [npm](http://github.com/isaacs/npm):

```sh
$ npm install resolvmon
```

Or get `resolvmon` directly from:
https://github.com/imyller/node-resolvmon

Synopsis
--------

### Basic

```javascript

// import the module and start monitoring

var resolvmon = require('resolvmon').start();

```

### Advanced

```javascript

// import the module

var resolvmon = require('resolvmon');

// listen for error events

resolvmon.on('error', function (err) {
	console.error(err);
});

// listen for update events

resolvmon.on('update', function (nameservers) {
	console.dir(nameservers);
});

// trigger manual update

resolvmon.update();

// start monitoring

resolvmon.start();

```

Testing
-------

```sh
$ npm test
```

Contributing
------------

You can find the repository at:
https://github.com/imyller/node-resolvmon

Issues/Feature Requests can be submitted at:
https://github.com/imyller/node-resolvmon/issues

I'd really like to hear your feedback, and I'd love to receive your
pull-requests!

Copyright
---------

Copyright 2015 Ilkka Myller. This software is licensed
under the MIT License, see `LICENSE` for details.
