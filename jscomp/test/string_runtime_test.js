// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Mt = require("./mt.js");
let List = require("../../lib/js/list.js");
let Bytes = require("../../lib/js/bytes.js");
let Test_char = require("./test_char.js");
let Caml_bytes = require("../../lib/js/caml_bytes.js");

let suites_0 = [
  "?is_printable",
  param => ({
    TAG: "Eq",
    _0: Test_char.caml_is_printable(/* 'a' */97),
    _1: true
  })
];

let suites_1 = {
  hd: [
    "?string_of_bytes",
    param => {
      let match = List.split(List.map(x => {
        let b = Caml_bytes.create(x);
        Bytes.fill(b, 0, x, /* 'c' */99);
        return [
          Bytes.to_string(b),
          Bytes.unsafe_to_string(Bytes.init(x, param => /* 'c' */99))
        ];
      }, {
        hd: 1000,
        tl: {
          hd: 1024,
          tl: {
            hd: 1025,
            tl: {
              hd: 4095,
              tl: {
                hd: 4096,
                tl: {
                  hd: 5000,
                  tl: {
                    hd: 10000,
                    tl: /* [] */0
                  }
                }
              }
            }
          }
        }
      }));
      return {
        TAG: "Eq",
        _0: match[0],
        _1: match[1]
      };
    }
  ],
  tl: /* [] */0
};

let suites = {
  hd: suites_0,
  tl: suites_1
};

Mt.from_pair_suites("String_runtime_test", suites);

let S;

let B;

exports.S = S;
exports.B = B;
exports.suites = suites;
/*  Not a pure module */
