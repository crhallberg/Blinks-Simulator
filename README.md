# Blinks Simulator

Recreates the [Blink SDK API](https://move38.github.io/Blinks-SDK-Docs-EN/) in Javascript.

```javascript
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
```

## TODO
- [ ] Button Presses
- [ ] Local variables for tiles
- [ ] Tests
  - [x] api.d.ts added, no index.js to test so no [check-dts](https://github.com/ai/check-dts)
  - [ ] mocha

### Wishlist

I'm not sure these things are possible.

- [ ] Make useable without API prefix
