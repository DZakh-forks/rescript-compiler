// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Caml_string = require("../../lib/js/caml_string.js");
let Caml_exceptions = require("../../lib/js/caml_exceptions.js");
let Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");

function $$finally(v, action, f) {
  let e;
  try {
    e = f(v);
  } catch (e$1) {
    action(v);
    throw new Error(e$1.RE_EXN_ID, {
          cause: e$1
        });
  }
  action(v);
  return e;
}

function is_pos_pow(n) {
  let E = /* @__PURE__ */Caml_exceptions.create("E");
  try {
    let _c = 0;
    let _n = n;
    while(true) {
      let n$1 = _n;
      let c = _c;
      if (n$1 <= 0) {
        return -2;
      }
      if (n$1 === 1) {
        return c;
      }
      if ((n$1 & 1) === 0) {
        _n = (n$1 >> 1);
        _c = c + 1 | 0;
        continue;
      }
      throw new Error(E, {
            cause: {
              RE_EXN_ID: E
            }
          });
    };
  } catch (raw_exn) {
    let exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === E) {
      return -1;
    }
    throw new Error(exn.RE_EXN_ID, {
          cause: exn
        });
  }
}

function is_pos_pow_2(n) {
  let E = /* @__PURE__ */Caml_exceptions.create("E");
  try {
    let _c = 0;
    let _n = n;
    while(true) {
      let n$1 = _n;
      let c = _c;
      if (n$1 <= 0) {
        return -2;
      }
      if (n$1 === 1) {
        return c;
      }
      if ((n$1 & 1) === 0) {
        _n = (n$1 >> 1);
        _c = c + 1 | 0;
        continue;
      }
      throw new Error(E, {
            cause: {
              RE_EXN_ID: E
            }
          });
    };
  } catch (raw_exn) {
    let exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === E) {
      return -1;
    }
    throw new Error(exn.RE_EXN_ID, {
          cause: exn
        });
  }
}

function hash_variant(s) {
  let accu = 0;
  for (let i = 0, i_finish = s.length; i < i_finish; ++i) {
    accu = Math.imul(223, accu) + Caml_string.get(s, i) | 0;
  }
  accu = accu & 2147483647;
  if (accu > 1073741823) {
    return accu - -2147483648 | 0;
  } else {
    return accu;
  }
}

let LargeFile = {
  u: 3
};

exports.$$finally = $$finally;
exports.is_pos_pow = is_pos_pow;
exports.is_pos_pow_2 = is_pos_pow_2;
exports.hash_variant = hash_variant;
exports.LargeFile = LargeFile;
/* No side effect */
