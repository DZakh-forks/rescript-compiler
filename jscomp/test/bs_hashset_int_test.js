// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Mt = require("./mt.js");
let Belt_Array = require("../../lib/js/belt_Array.js");
let Belt_SetInt = require("../../lib/js/belt_SetInt.js");
let Array_data_util = require("./array_data_util.js");
let Belt_HashSetInt = require("../../lib/js/belt_HashSetInt.js");
let Belt_SortArrayInt = require("../../lib/js/belt_SortArrayInt.js");
let Belt_internalBucketsType = require("../../lib/js/belt_internalBucketsType.js");

let suites = {
  contents: /* [] */0
};

let test_id = {
  contents: 0
};

function eq(loc, x, y) {
  Mt.eq_suites(test_id, suites, loc, x, y);
}

function b(loc, x) {
  Mt.bool_suites(test_id, suites, loc, x);
}

function add(x, y) {
  return x + y | 0;
}

function sum2(h) {
  let v = {
    contents: 0
  };
  Belt_HashSetInt.forEach(h, (function (x) {
    v.contents = v.contents + x | 0;
  }));
  return v.contents;
}

let u = Belt_Array.concat(Array_data_util.randomRange(30, 100), Array_data_util.randomRange(40, 120));

let v = Belt_HashSetInt.fromArray(u);

eq("File \"bs_hashset_int_test.res\", line 20, characters 5-12", v.size, 91);

let xs = Belt_SetInt.toArray(Belt_SetInt.fromArray(Belt_HashSetInt.toArray(v)));

eq("File \"bs_hashset_int_test.res\", line 22, characters 5-12", xs, Array_data_util.range(30, 120));

eq("File \"bs_hashset_int_test.res\", line 24, characters 5-12", Belt_HashSetInt.reduce(v, 0, add), 6825);

eq("File \"bs_hashset_int_test.res\", line 25, characters 5-12", sum2(v), 6825);

let u$1 = Belt_Array.concat(Array_data_util.randomRange(0, 100000), Array_data_util.randomRange(0, 100));

let v$1 = Belt_internalBucketsType.make(undefined, undefined, 40);

Belt_HashSetInt.mergeMany(v$1, u$1);

eq("File \"bs_hashset_int_test.res\", line 32, characters 5-12", v$1.size, 100001);

for (let i = 0; i <= 1000; ++i) {
  Belt_HashSetInt.remove(v$1, i);
}

eq("File \"bs_hashset_int_test.res\", line 36, characters 5-12", v$1.size, 99000);

for (let i$1 = 0; i$1 <= 2000; ++i$1) {
  Belt_HashSetInt.remove(v$1, i$1);
}

eq("File \"bs_hashset_int_test.res\", line 40, characters 5-12", v$1.size, 98000);

let u0 = Belt_HashSetInt.fromArray(Array_data_util.randomRange(0, 100000));

let u1 = Belt_HashSetInt.copy(u0);

eq("File \"bs_hashset_int_test.res\", line 49, characters 5-12", Belt_HashSetInt.toArray(u0), Belt_HashSetInt.toArray(u1));

for (let i$2 = 0; i$2 <= 2000; ++i$2) {
  Belt_HashSetInt.remove(u1, i$2);
}

for (let i$3 = 0; i$3 <= 1000; ++i$3) {
  Belt_HashSetInt.remove(u0, i$3);
}

let v0 = Belt_Array.concat(Array_data_util.range(0, 1000), Belt_HashSetInt.toArray(u0));

let v1 = Belt_Array.concat(Array_data_util.range(0, 2000), Belt_HashSetInt.toArray(u1));

Belt_SortArrayInt.stableSortInPlace(v0);

Belt_SortArrayInt.stableSortInPlace(v1);

eq("File \"bs_hashset_int_test.res\", line 60, characters 5-12", v0, v1);

let h = Belt_HashSetInt.fromArray(Array_data_util.randomRange(0, 1000000));

let histo = Belt_HashSetInt.getBucketHistogram(h);

b("File \"bs_hashset_int_test.res\", line 66, characters 4-11", histo.length <= 10);

Mt.from_pair_suites("Bs_hashset_int_test", suites.contents);

let N;

let S;

let I;

let $plus$plus = Belt_Array.concat;

let A;

let SI;

exports.suites = suites;
exports.test_id = test_id;
exports.eq = eq;
exports.b = b;
exports.N = N;
exports.S = S;
exports.I = I;
exports.$plus$plus = $plus$plus;
exports.add = add;
exports.sum2 = sum2;
exports.A = A;
exports.SI = SI;
/* u Not a pure module */
