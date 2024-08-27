// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let $$Array = require("../../lib/js/array.js");
let Caml_array = require("../../lib/js/caml_array.js");
let Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");

let v = {
  contents: 0
};

function f() {
  let arr = Caml_array.make(10, param => {});
  for (let i = 0; i <= 9; ++i) {
    Caml_array.set(arr, i, param => {
      v.contents = v.contents + i | 0;
    });
  }
  return arr;
}

let u = f();

$$Array.iter(x => x(), u);

if (v.contents !== 45) {
  throw Caml_js_exceptions.internalFromExtension({
    RE_EXN_ID: "Assert_failure",
    _1: [
      "test_closure.res",
      52,
      2
    ]
  });
}

exports.v = v;
exports.f = f;
/* u Not a pure module */
