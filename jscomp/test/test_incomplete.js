// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';


function f(x) {
  if (!(x > 3 || x < 1)) {
    return /* 'a' */97;
  }
  throw new Error("Match_failure", {
        cause: {
          RE_EXN_ID: "Match_failure",
          _1: [
            "test_incomplete.res",
            3,
            2
          ]
        }
      });
}

function f2(x) {
  if (x !== undefined) {
    return 0;
  } else {
    return 1;
  }
}

function f3(x) {
  switch (x.TAG) {
    case "A" :
    case "C" :
      return x._0 + 1 | 0;
    case "B" :
    case "D" :
      return x._0 + 2 | 0;
    
  }
}

exports.f = f;
exports.f2 = f2;
exports.f3 = f3;
/* No side effect */
