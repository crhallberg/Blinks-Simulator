import {
  init,
  pointer,
  initPointer,
  onPointerDown,
  onPointerUp
} from "../vendor/kontra.min.js";
import Loop from "./loop.js";
import { disconnectTile, connectTiles } from "./simulation.js";

let { canvas } = init();
let c = canvas.getContext("2d");
c.textAlign = "center";
c.textBaseline = "middle";

let count = 0;
function makeTile(tile) {
  tiles[tile.serial] = Object.assign({}, tile, {
    x: canvas.width / 2,
    y: canvas.height / 2
  });
  count += 1;
}
export default function updateTile(tile) {
  if (typeof tiles[tile.serial] === "undefined") {
    makeTile(tile);
  } else {
    tiles[tile.serial] = Object.assign({}, tiles[tile.serial], tile);
  }
  // render();
}

const HALF_PI = Math.PI / 2;
const TWO_PI = 2 * Math.PI;
const RADIUS = 50;
const SIXTH = TWO_PI / 6;
function drawTile(tile) {
  if (typeof tiles[tile.serial] === "undefined") {
    makeTile(tile);
  }

  let { x, y } = tiles[tile.serial];

  c.save();
  c.translate(x, y);

  if (DRAGGING) {
    c.beginPath();
    c.arc(0, 0, RADIUS * 2, 0, TWO_PI);
    c.stroke();
    c.closePath();
  }

  c.fillStyle = "#000";
  c.strokeStyle = "#fff";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(RADIUS, 0);
  for (let i = 1; i <= 6; i++) {
    c.lineTo(RADIUS * Math.cos(i * SIXTH), RADIUS * Math.sin(i * SIXTH));
  }
  c.fill();
  c.stroke();
  c.closePath();

  for (let f = 0; f < 6; f++) {
    let { hue, saturation, brightness, alpha } = tile.colors[f];
    c.fillStyle = `hsla(${hue}, ${saturation}%, ${brightness}%, ${alpha})`;
    c.beginPath();
    c.arc(0, RADIUS / 2, RADIUS / 6, RADIUS / 6, 0, TWO_PI);
    c.fill();
    c.stroke();
    c.closePath();

    c.fillStyle = "#fff";
    c.fillText(tile.values[f], -16, RADIUS);

    c.rotate(SIXTH);
  }
  c.restore();
}

function render() {
  c.fillStyle = "#444";
  c.fillRect(0, 0, canvas.width, canvas.height);
  if (DRAGGING) {
    tiles[DRAGGING].x = pointer.x;
    tiles[DRAGGING].y = pointer.y;
  }
  for (let serial in tiles) {
    drawTile(tiles[serial]);
  }
}

let tiles = {};
let loop = new Loop({
  update: () => {},
  render
});
loop.start();

initPointer();
let DRAGGING = false;
let CONNECT_RAD = 2.5 * RADIUS;

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

onPointerDown(function mouseDown() {
  console.log(pointer);
  for (let serial in tiles) {
    let tTile = tiles[serial];
    if (dist(pointer.x, pointer.y, tTile.x, tTile.y) < RADIUS) {
      disconnectTile(serial);
      DRAGGING = serial;
      break;
    }
  }
});
onPointerUp(function mouseUp() {
  if (DRAGGING === false) {
    return;
  }
  for (let serial in tiles) {
    if (serial === DRAGGING) {
      continue;
    }
    let tTile = tiles[serial];
    let d = dist(pointer.x, pointer.y, tTile.x, tTile.y);
    if (d < CONNECT_RAD) {
      let theta = Math.atan2(tTile.y - pointer.y, tTile.x - pointer.x);
      let normTheta = (theta + TWO_PI + HALF_PI + SIXTH / 2) % TWO_PI;
      let face = Math.floor(normTheta / SIXTH);
      connectTiles(serial, face, DRAGGING, (face + 3) % 6);
      tiles[DRAGGING].x = tTile.x - (RADIUS * 2 + 4) * Math.sin(face * SIXTH);
      tiles[DRAGGING].y = tTile.y + (RADIUS * 2 + 4) * Math.cos(face * SIXTH);
    }
  }
  DRAGGING = false;
});
