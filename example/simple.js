'use strict';

let co = require('co');

let CoEtcd = require('../lib/CoEtcd');

let etcd = new CoEtcd('127.0.0.1');

//
// Functions are now yieldable
//

co(function *() {
  let result;

  // print the contents of the base directory
  result = yield etcd.get('');

  console.log(JSON.stringify(result, null, '  '));
}).catch((e) => { console.log(e.stack); });
