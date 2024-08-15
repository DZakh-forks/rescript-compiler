// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Caml = require("../../lib/js/caml.js");
let List = require("../../lib/js/list.js");

function height(param) {
  if (typeof param !== "object") {
    return 0;
  } else {
    return param.h;
  }
}

function create(l, x, d, r) {
  let hl = height(l);
  let hr = height(r);
  return {
    TAG: "Node",
    l: l,
    v: x,
    d: d,
    r: r,
    h: hl >= hr ? hl + 1 | 0 : hr + 1 | 0
  };
}

function bal(l, x, d, r) {
  let hl;
  hl = typeof l !== "object" ? 0 : l.h;
  let hr;
  hr = typeof r !== "object" ? 0 : r.h;
  if (hl > (hr + 2 | 0)) {
    if (typeof l !== "object") {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "Map.bal"
      };
    }
    let lr = l.r;
    let ld = l.d;
    let lv = l.v;
    let ll = l.l;
    if (height(ll) >= height(lr)) {
      return create(ll, lv, ld, create(lr, x, d, r));
    }
    if (typeof lr === "object") {
      return create(create(ll, lv, ld, lr.l), lr.v, lr.d, create(lr.r, x, d, r));
    }
    throw {
      RE_EXN_ID: "Invalid_argument",
      _1: "Map.bal"
    };
  }
  if (hr <= (hl + 2 | 0)) {
    return {
      TAG: "Node",
      l: l,
      v: x,
      d: d,
      r: r,
      h: hl >= hr ? hl + 1 | 0 : hr + 1 | 0
    };
  }
  if (typeof r !== "object") {
    throw {
      RE_EXN_ID: "Invalid_argument",
      _1: "Map.bal"
    };
  }
  let rr = r.r;
  let rd = r.d;
  let rv = r.v;
  let rl = r.l;
  if (height(rr) >= height(rl)) {
    return create(create(l, x, d, rl), rv, rd, rr);
  }
  if (typeof rl === "object") {
    return create(create(l, x, d, rl.l), rl.v, rl.d, create(rl.r, rv, rd, rr));
  }
  throw {
    RE_EXN_ID: "Invalid_argument",
    _1: "Map.bal"
  };
}

function add(x, data, param) {
  if (typeof param !== "object") {
    return {
      TAG: "Node",
      l: "Empty",
      v: x,
      d: data,
      r: "Empty",
      h: 1
    };
  }
  let r = param.r;
  let d = param.d;
  let v = param.v;
  let l = param.l;
  let c = Caml.int_compare(x, v);
  if (c === 0) {
    if (d === data) {
      return param;
    } else {
      return {
        TAG: "Node",
        l: l,
        v: x,
        d: data,
        r: r,
        h: param.h
      };
    }
  }
  if (c < 0) {
    let ll = add(x, data, l);
    if (l === ll) {
      return param;
    } else {
      return bal(ll, v, d, r);
    }
  }
  let rr = add(x, data, r);
  if (r === rr) {
    return param;
  } else {
    return bal(l, v, d, rr);
  }
}

List.fold_left((function (acc, param) {
  return add(param[0], param[1], acc);
}), "Empty", {
  hd: [
    10,
    /* 'a' */97
  ],
  tl: {
    hd: [
      3,
      /* 'b' */98
    ],
    tl: {
      hd: [
        7,
        /* 'c' */99
      ],
      tl: {
        hd: [
          20,
          /* 'd' */100
        ],
        tl: /* [] */0
      }
    }
  }
});

/*  Not a pure module */
