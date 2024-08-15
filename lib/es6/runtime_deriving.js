


function raiseWhenNotFound(x) {
  if (x == null) {
    throw {
      RE_EXN_ID: "Not_found"
    };
  }
  return x;
}

export {
  raiseWhenNotFound,
}
/* No side effect */
