import { API as T, Blinks } from "./lib/index.js";
import renderFunc from "./lib/drag-drop.js";

function setup() {
  T.setValueSentOnAllFaces(0);
}

function loop() {
  if (T.isAlone()) {
    T.setColor(T.OFF);
  }

  let second = Math.floor(T.millis() / 1000);
  T.setValueSentOnFace(second, second % 6);
  T.FOREACH_FACE(i => {
    if (T.isValueReceivedOnFaceExpired(i)) {
      T.setColorOnFace(T.OFF, i);
    } else {
      let v = T.getLastValueReceivedOnFace(i);
      T.setColorOnFace(T.makeColorHSB(v * 4 * 6, 255, 100), i);
    }
  });
}

let simulation = Blinks.simulate({ setup, loop });
Blinks.setRender(renderFunc);
simulation.start();

Blinks.addTile();
Blinks.addTile();
Blinks.addTile();
Blinks.addTile();
