// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let React = require("react");

function dd() {
  throw {
    RE_EXN_ID: "Not_found"
  };
}

let h = sum(1.0, 2.0);

let M = {
  sum: (function (prim0, prim1) {
    return sum(prim0, prim1);
  })
};

let hh = M.sum(1.0, 2.0);

let mf = 3 % 4;

function tg(arr) {
  return arr[0];
}

let tc = Object.assign({}, "abc");

let te = {
  RE_EXN_ID: "Not_found"
};

let tcr = {};

function tsiC(c) {
  c.increment = (function (amount) {
    let me = this ;
    console.log(me);
  });
}

function tsiU(c) {
  c.increment = (function (amount) {
    let me = this ;
    console.log(me);
  });
}

let match = React.useState(function () {
  return 3;
});

let StandardNotation_get = match[0];

let StandardNotation_set = match[1];

let StandardNotation = {
  dd: dd,
  h: h,
  M: M,
  hh: hh,
  mf: mf,
  tg: tg,
  tc: tc,
  te: te,
  tcr: tcr,
  tsiC: tsiC,
  tsiU: tsiU,
  get: StandardNotation_get,
  set: StandardNotation_set
};

function methodWithAsync() {
  let $$this = this ;
  return async function (arg) {
    return $$this + arg | 0;
  };
}

exports.StandardNotation = StandardNotation;
exports.methodWithAsync = methodWithAsync;
/* h Not a pure module */
