'use strict';

//
// Error management
//

let checkpoint = module.exports.checkpoint = function (condition, error) {
  if (!condition) toss(error);
  return {
    and: module.exports.checkpoint
  };
};


let toss = module.exports.toss = function (msg) {
  let error = new Error(msg);
  throw error;
};

//
// Promise utilities
//

let autoResolve = module.exports.autoResolve = function (resolve, reject) {
  return function (err, result) {
    if (err) return reject(err);
    return resolve(result);
  };
};

let simplePromise = module.exports.simplePromise = function (resolver) {
  return new Promise(function (resolve, reject) {
    resolver(autoResolve(resolve, reject));
  });
};

//
// general utilities
//

let objToArray = module.exports.objToArray = function (obj) {
  return Array.prototype.slice.call(obj);
};
