

import * as Caml_option from "./caml_option.js";
import * as Caml_exceptions from "./caml_exceptions.js";

let $$Error = "JsError";

class RescriptError extends Error {}
;

function internalMakeExn(exnId, payload) {
  let error = (new RescriptError(exnId));
  error._1 = payload;
  error.RE_EXN_ID = exnId;
  return error;
}

function internalToOCamlException(e) {
  if (Caml_exceptions.is_extension(e.cause)) {
    return e.cause;
  } else {
    return {
      RE_EXN_ID: "JsError",
      _1: e
    };
  }
}

function as_js_exn(exn) {
  if (exn.RE_EXN_ID === $$Error) {
    return Caml_option.some(exn._1);
  }
  
}

export {
  $$Error,
  internalMakeExn,
  internalToOCamlException,
  as_js_exn,
}
/*  Not a pure module */
