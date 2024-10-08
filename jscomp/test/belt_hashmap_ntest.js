// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Caml = require("../../lib/js/caml.js");
let Hashtbl = require("../../lib/js/hashtbl.js");
let Nodetest = require("node:test");
let Belt_Array = require("../../lib/js/belt_Array.js");
let Belt_HashMap = require("../../lib/js/belt_HashMap.js");
let Belt_SortArray = require("../../lib/js/belt_SortArray.js");
let Node_test_util = require("./node_test_util.js");
let Array_data_util = require("./array_data_util.js");
let Belt_internalBucketsType = require("../../lib/js/belt_internalBucketsType.js");

function intEq(x, y) {
  return x === y;
}

let intHash = Hashtbl.hash;

let cmp = Caml.int_compare;

let Y = {
  hash: intHash,
  eq: intEq
};

let empty = Belt_internalBucketsType.make(intHash, intEq, 30);

Nodetest.describe("Belt.HashMap", () => {
  Nodetest.test("fromArray", () => {
    let u = Belt_Array.concat(Array_data_util.randomRange(30, 100), Array_data_util.randomRange(40, 120));
    let v = Belt_Array.zip(u, u);
    let xx = Belt_HashMap.fromArray(v, Y);
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 21, characters 7-14", xx.size, 91);
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 22, characters 7-14", Belt_SortArray.stableSortBy(Belt_HashMap.keysToArray(xx), cmp), Array_data_util.range(30, 120));
  });
  Nodetest.test("mergeMany", () => {
    Belt_HashMap.mergeMany(empty, [
      [
        1,
        1
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        2,
        2
      ]
    ]);
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 27, characters 7-14", Belt_HashMap.get(empty, 2), 2);
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 28, characters 7-14", empty.size, 3);
  });
  Nodetest.test("remove", () => {
    let u = Belt_Array.concat(Array_data_util.randomRange(0, 100000), Array_data_util.randomRange(0, 100));
    let v = Belt_internalBucketsType.make(intHash, intEq, 40);
    Belt_HashMap.mergeMany(v, Belt_Array.zip(u, u));
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 35, characters 7-14", v.size, 100001);
    for (let i = 0; i <= 1000; ++i) {
      Belt_HashMap.remove(v, i);
    }
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 39, characters 7-14", v.size, 99000);
    for (let i$1 = 0; i$1 <= 2000; ++i$1) {
      Belt_HashMap.remove(v, i$1);
    }
    Node_test_util.eq("File \"belt_hashmap_ntest.res\", line 43, characters 7-14", v.size, 98000);
    Node_test_util.ok("File \"belt_hashmap_ntest.res\", line 44, characters 7-14", Belt_Array.every(Array_data_util.range(2001, 100000), x => Belt_HashMap.has(v, x)));
  });
});

let N;

let S;

let I;

let A;

let So;

exports.N = N;
exports.S = S;
exports.I = I;
exports.A = A;
exports.So = So;
exports.intEq = intEq;
exports.intHash = intHash;
exports.cmp = cmp;
exports.Y = Y;
exports.empty = empty;
/* empty Not a pure module */
