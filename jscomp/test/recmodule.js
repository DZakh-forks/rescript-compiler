// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

let Caml_module = require("../../lib/js/caml_module.js");

let Entity = {};

function MakeLayer(Deps) {
  let getLight = id => Deps.presentLight({
    id: id,
    name: "Light 1"
  });
  return {
    getLight: getLight
  };
}

let UseCase = {
  MakeLayer: MakeLayer
};

function MakeLayer$1(Deps, UC) {
  let presentLight = light => Deps.presentJson(light, 200);
  let handleGetLight = req => UC.getLight(req.params.id);
  return {
    handleGetLight: handleGetLight,
    presentLight: presentLight
  };
}

let Adapter = {
  MakeLayer: MakeLayer$1
};

function MakeLayer$2(Deps) {
  let presentJson = (json, status) => {
    throw new Error("Assert_failure", {
      cause: {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "recmodule.res",
          60,
          41
        ]
      }
    });
  };
  let routes = () => [[
      "/lights",
      Deps.handleGetLight
    ]];
  return {
    presentJson: presentJson,
    routes: routes
  };
}

let Infra = {
  MakeLayer: MakeLayer$2
};

let I = Caml_module.init_mod([
  "recmodule.res",
  67,
  30
], {
  TAG: "Module",
  _0: [
    [
      "Function",
      "presentJson"
    ],
    [
      "Function",
      "routes"
    ]
  ]
});

let A = Caml_module.init_mod([
  "recmodule.res",
  68,
  25
], {
  TAG: "Module",
  _0: [
    [
      "Function",
      "handleGetLight"
    ],
    [
      "Function",
      "presentLight"
    ]
  ]
});

let U = Caml_module.init_mod([
  "recmodule.res",
  69,
  25
], {
  TAG: "Module",
  _0: [[
      "Function",
      "getLight"
    ]]
});

function presentJson(json, status) {
  throw new Error("Assert_failure", {
    cause: {
      RE_EXN_ID: "Assert_failure",
      _1: [
        "recmodule.res",
        60,
        41
      ]
    }
  });
}

function routes() {
  return [[
      "/lights",
      A.handleGetLight
    ]];
}

Caml_module.update_mod({
  TAG: "Module",
  _0: [
    [
      "Function",
      "presentJson"
    ],
    [
      "Function",
      "routes"
    ]
  ]
}, I, {
  presentJson: presentJson,
  routes: routes
});

function presentLight(light) {
  return I.presentJson(light, 200);
}

function handleGetLight(req) {
  return U.getLight(req.params.id);
}

Caml_module.update_mod({
  TAG: "Module",
  _0: [
    [
      "Function",
      "handleGetLight"
    ],
    [
      "Function",
      "presentLight"
    ]
  ]
}, A, {
  handleGetLight: handleGetLight,
  presentLight: presentLight
});

function getLight(id) {
  return A.presentLight({
    id: id,
    name: "Light 1"
  });
}

Caml_module.update_mod({
  TAG: "Module",
  _0: [[
      "Function",
      "getLight"
    ]]
}, U, {
  getLight: getLight
});

let App = {
  I: I,
  A: A,
  U: U
};

exports.Entity = Entity;
exports.UseCase = UseCase;
exports.Adapter = Adapter;
exports.Infra = Infra;
exports.App = App;
/* I Not a pure module */
