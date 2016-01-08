'use strict';

let Etcd = require('node-etcd');
let thenify = require('thenify');
let helpers = require('./helpers');
let _ = require('lodash');

// console.log(Object.getOwnPropertyNames(Etcd.prototype));

let simplePromise = helpers.simplePromise;
let toss = helpers.toss;
let checkpoint = helpers.checkpoint;
let objToArray = helpers.objToArray;

//
// Class definition
//

class CoEtcd extends Etcd {

  //
  // Constructor
  //

  constructor (host, port, sslopts, client) {
    super(host, port, sslopts, client);
  }

  //
  // Utility
  //

  _proto (name, params) {
    params = params || [];

    checkpoint(name, 'Function prototype name expected')
     .and(Etcd.prototype[name], 'Prototype function [' + name + '] not recognized')
     .and(_.isArray(params), 'Array of parameters expected as the second argument');

    return Etcd.prototype[name].apply(this, params);
  }

  _promisify (name, args) {
    let self = this;
    args = (_.isObject(args) ? objToArray(args) : args) || [];

    checkpoint(_.isString(name), 'Name of super prototype expected')
      .and(_.isArray(args), 'Array of parameters expected as the second argument');

    return simplePromise(function (done) {
      args.push(done);
      return self._proto(name, args);
    });
  }

  //
  // Overrides
  //

  set () { return this._promisify('set', arguments); }

  get () { return this._promisify('get', arguments); }

  create () { return this._promisify('create', arguments); }

  post () { return this._promisify('post', arguments); }

  del () { return this._promisify('del', arguments); }

  delete () { return this._promisify('delete', arguments); }

  mkdir () { return this._promisify('mkdir', arguments); }

  rmdir () { return this._promisify('rmdir', arguments); }

  compareAndSwap () { return this._promisify('compareAndSwap', arguments); }

  testAndSet () { return this._promisify('testAndSet', arguments); }

  compareAndDelete () { return this._promisify('compareAndDelete', arguments); }

  testAndDelete () { return this._promisify('testAndDelete', arguments); }

  raw () { return this._promisify('raw', arguments); }

  machines () { return this._promisify('machines', arguments); }

  getHosts () { return this._promisify('getHosts', arguments); }

  leader () { return this._promisify('leader', arguments); }

  leaderStats () { return this._promisify('leaderStats', arguments); }

  selfStats () { return this._promisify('selfStats', arguments); }

  nodeToTree (node) {
    // console.log('RECURSE', JSON.stringify(node, null, '  '));
    if (!Object.keys(node).length) return false;
    node = node.node || node;
    let result = {};

    _.each(node.nodes, (branch, index) => {
      // the last string in the keyspace is the current key
      let keySpace = branch.key.split('/');
      let key = keySpace[keySpace.length - 1];

      // Leaf
      if (branch.nodes) {
        result[key] = this.nodeToTree(branch);

      // Branch
      } else {
        let val = branch.value;
        if (val === 'true') val = true;
        if (val === 'false') val = false;
        result[key] = val;
      }
    });
    return result;
  }
}

//
// Export
//

module.exports = CoEtcd;
