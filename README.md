node-resolvmon
==============
[![Build Status](https://travis-ci.org/imyller/node-resolvmon.svg)](https://travis-ci.org/imyller/node-resolvmon)
![io.js supported](https://img.shields.io/badge/io.js-supported-green.svg?style=flat)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=imyller&url=https://github.com/imyller/node-resolvmon&title=node-resolvmon&language=&tags=github&category=software)

Automatically updates DNS server configuration if `resolv.conf` changes.

Watches `/etc/resolv.conf` (or similar) for changes and updates Node DNS servers accordingly.
Detects if `resolv.conf` is created, deleted, appended, modified or renamed.

Node Compatibility
---------------------

Supports Node.js v0.12.0+ and io.js v1.0.0+

Please let me know if you have problems running it on a later version of Node or
have platform-specific problems.

Installation
------------

Install it using [npm](http://github.com/isaacs/npm):

```sh
$ npm install resolvmon
```

Or get it directly from:
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
	console.log(JSON.stringify(nameservers)));
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

Copyright (c) 2015 Ilkka Myller. This software is licensed
under the MIT License, see `LICENSE` for details.
