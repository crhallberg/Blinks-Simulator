import * as API from "./api.js";
import Loop from "./loop.js";

/**
 * Core
 */
let _VALUES = []; // broadcasting
let _FACES = []; // receiving
let _CONNECTIONS = {};
let _COLORS = [];
let _SERIALS = [];
let _IS_SETUP = [];
let _ALL_SETUP = false;
let _COUNT = 0;

/**
 *
 */
export function addTile() {
  let set = API.millis();
  _VALUES.push([0, 0, 0, 0, 0, 0]);
  _CONNECTIONS[_COUNT] = {};
  _SERIALS.push(Math.floor(Math.random() * 888888888) + 111111111 + "");
  _FACES.push([
    { value: 0, last: 0, set },
    { value: 0, last: 0, set },
    { value: 0, last: 0, set },
    { value: 0, last: 0, set },
    { value: 0, last: 0, set },
    { value: 0, last: 0, set }
  ]);
  _COLORS.push([API.OFF, API.OFF, API.OFF, API.OFF, API.OFF, API.OFF]);
  _IS_SETUP.push(false);
  _ALL_SETUP = false;
  _COUNT += 1;
  return _COUNT - 1;
}

/**
 *
 */
export function connectTiles(index1, face1, index2, face2) {
  if (typeof index1 === "string") {
    index1 = _SERIALS.indexOf(index1);
  }
  if (typeof index2 === "string") {
    index2 = _SERIALS.indexOf(index2);
  }
  _CONNECTIONS[index1][face1] = { index: index2, face: face2 };
  _CONNECTIONS[index2][face2] = { index: index1, face: face1 };
}

/**
 *
 */
export function splitTiles(index1, index2) {
  for (let face in _CONNECTIONS[index1]) {
    if (_CONNECTIONS[index1][face].index === index2) {
      delete _CONNECTIONS[index1][face];
      break;
    }
  }
  for (let face in _CONNECTIONS[index2]) {
    if (_CONNECTIONS[index2][face].index === index1) {
      delete _CONNECTIONS[index2][face];
      break;
    }
  }
}

/**
 *
 */
export function disconnectTile(index) {
  if (typeof index === "string") {
    index = _SERIALS.indexOf(index);
  }
  for (let face in _CONNECTIONS[index]) {
    splitTiles(index, _CONNECTIONS[index][face].index);
  }
}

function _updateValues(i) {
  for (let f in _CONNECTIONS[i]) {
    let { index, face } = _CONNECTIONS[i][f];
    let last = _FACES[i][f].value;
    _FACES[i][f] = {
      value: _VALUES[index][face],
      set: API.millis(),
      last
    };
  }
}

function _getTile(index) {
  return {
    colors: _COLORS[index],
    values: _VALUES[index],
    faces: _FACES[index],
    serial: _SERIALS[index]
  };
}
function _setTile(index, { colors, faces, values }) {
  _COLORS[index] = colors;
  _FACES[index] = faces;
  _VALUES[index] = values;
}

function _setup(func) {
  for (let i = 0; i < _COUNT; i++) {
    if (_IS_SETUP[i] === false) {
      API._setCurrent(_getTile(i));
      func();
      _setTile(i, API._getCurrent());
      _IS_SETUP[i] = true;
    }
  }
}

function _update(func) {
  for (let i = 0; i < _COUNT; i++) {
    _updateValues(i);
  }
  for (let i = 0; i < _COUNT; i++) {
    API._setCurrent(_getTile(i));
    func();
    _setTile(i, API._getCurrent());
  }
}

function _step(dt) {
  if (!_ALL_SETUP) {
    _setup(simulation.setup);
    _ALL_SETUP = true;
  }
  _update(simulation.loop);
}

let _renderFunc = () => {}; // noop
export function setRender(func) {
  _renderFunc = func;
}
function _render() {
  for (let i = 0; i < _COUNT; i++) {
    _renderFunc(_getTile(i));
  }
}

let simulation;
export function simulate({ fps = 30, setup, loop }) {
  simulation = new Loop({ fps, update: _step, render: _render });
  simulation.setup = setup;
  simulation.loop = loop;
  simulation.step = () => {
    _step(1 / 30);
    _render();
  };

  return simulation;
}
