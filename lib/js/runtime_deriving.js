'use strict';


function raiseWhenNotFound(x) {
  if (x == null) {
    throw {
      RE_EXN_ID: "Not_found"
    };
  }
  return x;
}

exports.raiseWhenNotFound = raiseWhenNotFound;
/* No side effect */
