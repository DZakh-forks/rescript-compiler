// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Mt = require("./mt.js");
let Arg = require("../../lib/js/arg.js");
let List = require("../../lib/js/list.js");
let Caml_obj = require("../../lib/js/caml_obj.js");

let current = {
  contents: 0
};

let accum = {
  contents: /* [] */0
};

function record(fmt) {
  accum.contents = {
    hd: fmt,
    tl: accum.contents
  };
}

function f_unit() {
  record("unit()");
}

function f_bool(b) {
  record("bool(" + b + ")");
}

let r_set = {
  contents: false
};

let r_clear = {
  contents: true
};

function f_string(s) {
  record("string(" + s + ")");
}

let r_string = {
  contents: ""
};

function f_int(i) {
  record("int(" + i + ")");
}

let r_int = {
  contents: 0
};

function f_float(f) {
  record("float(" + f + ")");
}

let r_float = {
  contents: 0.0
};

function f_symbol(s) {
  record("symbol(" + s + ")");
}

function f_rest(s) {
  record("rest(" + s + ")");
}

function f_anon(s) {
  record("anon(" + s + ")");
}

let spec_0 = [
  "-u",
  {
    TAG: "Unit",
    _0: f_unit
  },
  "Unit (0)"
];

let spec_1 = {
  hd: [
    "-b",
    {
      TAG: "Bool",
      _0: f_bool
    },
    "Bool (1)"
  ],
  tl: {
    hd: [
      "-s",
      {
        TAG: "Set",
        _0: r_set
      },
      "Set (0)"
    ],
    tl: {
      hd: [
        "-c",
        {
          TAG: "Clear",
          _0: r_clear
        },
        "Clear (0)"
      ],
      tl: {
        hd: [
          "-str",
          {
            TAG: "String",
            _0: f_string
          },
          "String (1)"
        ],
        tl: {
          hd: [
            "-sstr",
            {
              TAG: "Set_string",
              _0: r_string
            },
            "Set_string (1)"
          ],
          tl: {
            hd: [
              "-i",
              {
                TAG: "Int",
                _0: f_int
              },
              "Int (1)"
            ],
            tl: {
              hd: [
                "-si",
                {
                  TAG: "Set_int",
                  _0: r_int
                },
                "Set_int (1)"
              ],
              tl: {
                hd: [
                  "-f",
                  {
                    TAG: "Float",
                    _0: f_float
                  },
                  "Float (1)"
                ],
                tl: {
                  hd: [
                    "-sf",
                    {
                      TAG: "Set_float",
                      _0: r_float
                    },
                    "Set_float (1)"
                  ],
                  tl: {
                    hd: [
                      "-t",
                      {
                        TAG: "Tuple",
                        _0: {
                          hd: {
                            TAG: "Bool",
                            _0: f_bool
                          },
                          tl: {
                            hd: {
                              TAG: "String",
                              _0: f_string
                            },
                            tl: {
                              hd: {
                                TAG: "Int",
                                _0: f_int
                              },
                              tl: /* [] */0
                            }
                          }
                        }
                      },
                      "Tuple (3)"
                    ],
                    tl: {
                      hd: [
                        "-sym",
                        {
                          TAG: "Symbol",
                          _0: {
                            hd: "a",
                            tl: {
                              hd: "b",
                              tl: {
                                hd: "c",
                                tl: /* [] */0
                              }
                            }
                          },
                          _1: f_symbol
                        },
                        "Symbol (1)"
                      ],
                      tl: {
                        hd: [
                          "-rest",
                          {
                            TAG: "Rest",
                            _0: f_rest
                          },
                          "Rest (*)"
                        ],
                        tl: /* [] */0
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

let spec = {
  hd: spec_0,
  tl: spec_1
};

let args1 = [
  "prog",
  "anon1",
  "-u",
  "-b",
  "true",
  "-s",
  "anon2",
  "-c",
  "-str",
  "foo",
  "-sstr",
  "bar",
  "-i",
  "19",
  "-si",
  "42",
  "-f",
  "3.14",
  "-sf",
  "2.72",
  "anon3",
  "-t",
  "false",
  "gee",
  "1436",
  "-sym",
  "c",
  "anon4",
  "-rest",
  "r1",
  "r2"
];

let args2 = [
  "prog",
  "anon1",
  "-u",
  "-b=true",
  "-s",
  "anon2",
  "-c",
  "-str=foo",
  "-sstr=bar",
  "-i=19",
  "-si=42",
  "-f=3.14",
  "-sf=2.72",
  "anon3",
  "-t",
  "false",
  "gee",
  "1436",
  "-sym=c",
  "anon4",
  "-rest",
  "r1",
  "r2"
];

function error(s) {
  console.log("error (" + (s + ")"));
}

function check(r, v, msg) {
  if (Caml_obj.notequal(r.contents, v)) {
    return error(msg);
  }
  
}

function test(argv) {
  current.contents = 0;
  r_set.contents = false;
  r_clear.contents = true;
  r_string.contents = "";
  r_int.contents = 0;
  r_float.contents = 0.0;
  accum.contents = /* [] */0;
  Arg.parse_argv(current, argv, spec, f_anon, "usage");
  let result = List.rev(accum.contents);
  let reference = {
    hd: "anon(anon1)",
    tl: {
      hd: "unit()",
      tl: {
        hd: "bool(true)",
        tl: {
          hd: "anon(anon2)",
          tl: {
            hd: "string(foo)",
            tl: {
              hd: "int(19)",
              tl: {
                hd: "float(3.14)",
                tl: {
                  hd: "anon(anon3)",
                  tl: {
                    hd: "bool(false)",
                    tl: {
                      hd: "string(gee)",
                      tl: {
                        hd: "int(1436)",
                        tl: {
                          hd: "symbol(c)",
                          tl: {
                            hd: "anon(anon4)",
                            tl: {
                              hd: "rest(r1)",
                              tl: {
                                hd: "rest(r2)",
                                tl: /* [] */0
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (Caml_obj.notequal(result, reference)) {
    let f = (x, y) => {
      console.log(x, y);
    };
    List.iter2(f, result, reference);
  }
  check(r_set, true, "Set");
  check(r_clear, false, "Clear");
  check(r_string, "bar", "Set_string");
  check(r_int, 42, "Set_int");
  check(r_float, 2.72, "Set_float");
}

test(args1);

test(args2);

Mt.from_pair_suites("Libarg_test", /* [] */0);

let suites = /* [] */0;

exports.current = current;
exports.accum = accum;
exports.record = record;
exports.f_unit = f_unit;
exports.f_bool = f_bool;
exports.r_set = r_set;
exports.r_clear = r_clear;
exports.f_string = f_string;
exports.r_string = r_string;
exports.f_int = f_int;
exports.r_int = r_int;
exports.f_float = f_float;
exports.r_float = r_float;
exports.f_symbol = f_symbol;
exports.f_rest = f_rest;
exports.f_anon = f_anon;
exports.spec = spec;
exports.args1 = args1;
exports.args2 = args2;
exports.error = error;
exports.check = check;
exports.test = test;
exports.suites = suites;
/*  Not a pure module */
