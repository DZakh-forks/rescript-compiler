// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let List = require("../../lib/js/list.js");
let $$Array = require("../../lib/js/array.js");
let Caml_array = require("../../lib/js/caml_array.js");

function for_3(x) {
  let v = {
    contents: 0
  };
  let arr = $$Array.map((function (param) {
    return function () {
      
    };
  }), x);
  for (let i = 0, i_finish = x.length; i < i_finish; ++i) {
    let j = (i << 1);
    Caml_array.set(arr, i, (function () {
      v.contents = v.contents + j | 0;
    }));
  }
  $$Array.iter((function (x) {
    x();
  }), arr);
  return v.contents;
}

function for_4(x) {
  let v = {
    contents: 0
  };
  let arr = $$Array.map((function (param) {
    return function () {
      
    };
  }), x);
  for (let i = 0, i_finish = x.length; i < i_finish; ++i) {
    let j = (i << 1);
    let k = (j << 1);
    Caml_array.set(arr, i, (function () {
      v.contents = v.contents + k | 0;
    }));
  }
  $$Array.iter((function (x) {
    x();
  }), arr);
  return v.contents;
}

function for_5(x, u) {
  let v = {
    contents: 0
  };
  let arr = $$Array.map((function (param) {
    return function () {
      
    };
  }), x);
  for (let i = 0, i_finish = x.length; i < i_finish; ++i) {
    let k = Math.imul((u << 1), u);
    Caml_array.set(arr, i, (function () {
      v.contents = v.contents + k | 0;
    }));
  }
  $$Array.iter((function (x) {
    x();
  }), arr);
  return v.contents;
}

function for_6(x, u) {
  let v = {
    contents: 0
  };
  let arr = $$Array.map((function (param) {
    return function () {
      
    };
  }), x);
  let v4 = {
    contents: 0
  };
  let v5 = {
    contents: 0
  };
  let inspect_3 = -1;
  v4.contents = v4.contents + 1 | 0;
  for (let j = 0; j <= 1; ++j) {
    v5.contents = v5.contents + 1 | 0;
    let v2 = {
      contents: 0
    };
    for (let i = 0, i_finish = x.length; i < i_finish; ++i) {
      let k = Math.imul((u << 1), u);
      let h = (v5.contents << 1);
      v2.contents = v2.contents + 1 | 0;
      Caml_array.set(arr, i, (function () {
        v.contents = (((((v.contents + k | 0) + v2.contents | 0) + v4.contents | 0) + v5.contents | 0) + h | 0) + u | 0;
      }));
    }
    inspect_3 = v2.contents;
  }
  $$Array.iter((function (x) {
    x();
  }), arr);
  return [
    v.contents,
    v4.contents,
    v5.contents,
    inspect_3
  ];
}

function for_7() {
  let v = {
    contents: 0
  };
  let arr = Caml_array.make(21, (function () {
    
  }));
  for (let i = 0; i <= 6; ++i) {
    for (let j = 0; j <= 2; ++j) {
      Caml_array.set(arr, Math.imul(i, 3) + j | 0, (function () {
        v.contents = (v.contents + i | 0) + j | 0;
      }));
    }
  }
  $$Array.iter((function (f) {
    f();
  }), arr);
  return v.contents;
}

function for_8() {
  let v = {
    contents: 0
  };
  let arr = Caml_array.make(21, (function () {
    
  }));
  for (let i = 0; i <= 6; ++i) {
    let k = (i << 1);
    for (let j = 0; j <= 2; ++j) {
      let h = i + j | 0;
      Caml_array.set(arr, Math.imul(i, 3) + j | 0, (function () {
        v.contents = (((v.contents + i | 0) + j | 0) + h | 0) + k | 0;
      }));
    }
  }
  $$Array.iter((function (f) {
    f();
  }), arr);
  return v.contents;
}

function for_9() {
  let v = {
    contents: /* [] */0
  };
  let collect = function (x) {
    v.contents = {
      hd: x,
      tl: v.contents
    };
  };
  let vv = {
    contents: 0
  };
  let vv2 = {
    contents: 0
  };
  let arr = Caml_array.make(4, (function () {
    
  }));
  let arr2 = Caml_array.make(2, (function () {
    
  }));
  for (let i = 0; i <= 1; ++i) {
    let v$1 = {
      contents: 0
    };
    v$1.contents = v$1.contents + i | 0;
    for (let j = 0; j <= 1; ++j) {
      v$1.contents = v$1.contents + 1 | 0;
      collect(v$1.contents);
      Caml_array.set(arr, (i << 1) + j | 0, (function () {
        vv.contents = vv.contents + v$1.contents | 0;
      }));
    }
    Caml_array.set(arr2, i, (function () {
      vv2.contents = vv2.contents + v$1.contents | 0;
    }));
  }
  $$Array.iter((function (f) {
    f();
  }), arr);
  $$Array.iter((function (f) {
    f();
  }), arr2);
  return [[
      vv.contents,
      $$Array.of_list(List.rev(v.contents)),
      vv2.contents
    ]];
}

let suites_0 = [
  "for_loop_test_3",
  (function (param) {
    return {
      TAG: "Eq",
      _0: 90,
      _1: for_3(Caml_array.make(10, 2))
    };
  })
];

let suites_1 = {
  hd: [
    "for_loop_test_4",
    (function (param) {
      return {
        TAG: "Eq",
        _0: 180,
        _1: for_4(Caml_array.make(10, 2))
      };
    })
  ],
  tl: {
    hd: [
      "for_loop_test_5",
      (function (param) {
        return {
          TAG: "Eq",
          _0: 2420,
          _1: for_5(Caml_array.make(10, 2), 11)
        };
      })
    ],
    tl: {
      hd: [
        "for_loop_test_6",
        (function (param) {
          return {
            TAG: "Eq",
            _0: [
              30,
              1,
              2,
              3
            ],
            _1: for_6(Caml_array.make(3, 0), 0)
          };
        })
      ],
      tl: {
        hd: [
          "for_loop_test_7",
          (function (param) {
            return {
              TAG: "Eq",
              _0: 84,
              _1: for_7()
            };
          })
        ],
        tl: {
          hd: [
            "for_loop_test_8",
            (function (param) {
              return {
                TAG: "Eq",
                _0: 294,
                _1: for_8()
              };
            })
          ],
          tl: {
            hd: [
              "for_loop_test_9",
              (function (param) {
                return {
                  TAG: "Eq",
                  _0: [[
                      10,
                      [
                        1,
                        2,
                        2,
                        3
                      ],
                      5
                    ]],
                  _1: for_9()
                };
              })
            ],
            tl: /* [] */0
          }
        }
      }
    }
  }
};

let suites = {
  hd: suites_0,
  tl: suites_1
};

exports.for_3 = for_3;
exports.for_4 = for_4;
exports.for_5 = for_5;
exports.for_6 = for_6;
exports.for_7 = for_7;
exports.for_8 = for_8;
exports.for_9 = for_9;
exports.suites = suites;
/* No side effect */
