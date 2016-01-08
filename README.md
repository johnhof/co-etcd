Co Etcd
========

[![NPM](https://nodei.co/npm/co-etcd.png?downloads=true&stars=true)](https://nodei.co/npm/co-etcd/)

[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/johnhof/co-etcd/blob/master/LICENSE)  [![Dependencies](https://img.shields.io/david/johnhof/co-etcd.svg)](https://david-dm.org/johnhof/co-etcd)

A promise/co wrapper for the [node-etcd](https://www.npmjs.com/package/node-etcd) module. All functions from node-etcd are supported, but are converted to return a promise

```javscript
'use strict';

let CoEtcd = require('co-etcd');
let co = require('co');

co(function *() {
  let etcd = new CoEtcd('127.0.0.1');
  let result = yield etcd.get('');
  console.log(result);
}).catch((e) => { console.log(e.stack); });
```


## Additions

### etcd.nodeToTree()

#### Arguments
  - Javascript object in etcd node format

Â#### Returns
  - Node format converted into a JSON tree object

#### Example
```javascript
let config = yield etcd.get('');
console.log(config);
/*
{
  "action": "get",
  "node": {
    "key": "/config",
    "dir": true,
    "nodes": [
      {
        "key": "/config/etcd",
        "dir": true,
        "nodes": [
          {
            "key": "/config/etcd/host",
            "value": "somefoohost.com",
            "modifiedIndex": 2280,
            "createdIndex": 2280
          },
          {
            "key": "/config/etcd/active",
            "value": "true",
            "modifiedIndex": 2281,
            "createdIndex": 2281
          }
        ],
        "modifiedIndex": 1086,
        "createdIndex": 1086
      }
    ]
  }
}
*/

config = etcd.nodeToTree(config);
console.log(config);
/*
{
  config: {
    etcd: {
      host: "somefoohost",
      active: true
    }
  }
}
*/
```
