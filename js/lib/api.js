let _TILE = {
  colors: [],
  values: [],
  faces: [],
  serial: []
};
export function _setCurrent(tile) {
  _TILE = tile;
}
export function _getCurrent(tile) {
  return _TILE;
}

/**
 * Display
 */
export function setColor(color) {
  _TILE.colors = _TILE.colors.map(_ => color);
  // sets all 6 pixels on all faces to the same Color
}

export function setColorOnFace(color, face) {
  _TILE.colors[face] = color;
  // sets a single pixel on a face (0-5) to this Color
}

/**
 * Colors
 */

// R, G, and B values [0-255]
export function makeColorRGB(red, green, blue) {
  // https://github.com/gka/chroma.js/blob/master/src/io/hsv/rgb2hsv.js
  let r = Math.max(0, Math.min(255, red)) / 255;
  let g = Math.max(0, Math.min(255, green)) / 255;
  let b = Math.max(0, Math.min(255, blue)) / 255;

  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  let delta = max - min;
  let hue, saturation, brightness;
  brightness = max / 255.0;
  if (max === 0) {
    hue = 0;
    saturation = 0;
  } else {
    saturation = delta / max;
    if (r === max) hue = (g - b) / delta;
    if (g === max) hue = 2 + (b - r) / delta;
    if (b === max) hue = 4 + (r - g) / delta;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return makeColorHSB(hue, saturation, brightness * 100);
}

// H, S, and V values [0-255]
export function makeColorHSB(hue, saturation, brightness) {
  return {
    hue,
    saturation: saturation / 2.55,
    brightness: brightness / 2.55,
    alpha: 255
  };
}

export function dim({ hue, saturation, brightness }, value) {
  return {
    hue,
    saturation,
    brightness,
    alpha: Math.max(0, Math.min(255, value))
  };
  // returns the color passed in a dimmer state
  //(0-255 bucketed into 32 levels of brightness)
}

export const RED = makeColorRGB(255, 0, 0);
export const ORANGE = makeColorRGB(255, 127, 0);
export const YELLOW = makeColorRGB(255, 255, 0);
export const GREEN = makeColorRGB(0, 255, 0);
export const CYAN = makeColorRGB(0, 255, 255);
export const BLUE = makeColorRGB(0, 0, 255);
export const MAGENTA = makeColorRGB(255, 0, 255);
export const WHITE = makeColorRGB(255, 255, 255);
export const OFF = makeColorRGB(0, 0, 0);

/**
 * Button
 *
 * All button handling is done with flags, so when
 * you call a function, it returns the value of
 * the flag (i.e. whether or not that action
 * has occured) and only when you have
 * called the export function will it reset
 * the flag to false
 */

export function buttonPressed() {
  return false;
  // a flag is set to true on the change from button up to button down
  // buttonPressed() returns that flag and sets it back to false
}

export function buttonReleased() {
  return false;
  // a flag is set to true on the change from button
  // down to button up buttonReleased() returns that
  // flag and sets it back to false
}

export function buttonSingleClicked() {
  return false;
  // a flag is set to true when the the
  // button goes from down to up
  // only once in under 330ms. The flag is set exactly
  // 330ms after the button is up
  // buttonSingleClicked() returns that flag and sets it back to false
}

export function buttonDoubleClicked() {
  return false;
  // returns true when a double click has been recorded
  // (down-up-down-up under 330ms*)
  // ^ also a flag with the same properties as above
}

export function buttonMultiClicked() {
  return false;
  // returns true when multiple click has been recorded
  // (down-up...down-up under 330ms*)
  // ^ also a flag with the same properties as above
}

export function buttonClickCount() {
  return 0;
  // returns the number of clicks recorded during button multi clicking
}

export function buttonLongPressed() {
  return false;
  // returns true when the button has been down for more than 3000ms (3 seconds)
  // ^ also a flag with the same properties as above
}

export function buttonDown() {
  return false;
  // returns true when the button is down
  // ^ also a flag with the same properties as above
}

/**
 * Communication
 */
export function setValueSentOnAllFaces(value) {
  _TILE.values = _TILE.values.map(_ => value % 64);
  // sets a value (0-63) to be sent
  // repeatedly (every loop() cycle) on all 6 faces
}

export function setValueSentOnFace(value, face) {
  _TILE.values[face] = value % 64;
  // sets a value (0-63) to be sent repeatedly (every loop() cycle)
  // on the face specified
}

export function getLastValueReceivedOnFace(face) {
  return _TILE.faces[face].value;
  // retreives the last value seen on the
  // specified face even if expired
  // (i.e. last message from neighbor)
  // defaults to 0 on startup
}

export function isValueReceivedOnFaceExpired(face) {
  return millis() - _TILE.faces[face].set > 200;
  // returns true if the message from a
  // neighbor has expired
  // (i.e. it's been longer than 200ms since we last
  // received a message from this neighbor)
}

export function didValueOnFaceChange(face) {
  return _TILE.faces[face].value !== _TILE.faces[face].last;
  // returns true if the value on this face is different
  // from the last stored seen value on this face
}

export function isAlone() {
  for (let f = 0; f < FACE_COUNT; f++) {
    if (!isValueReceivedOnFaceExpired(f)) {
      return false;
    }
  }
  return true;
  // returns true if all faces have expired values
  // (i.e. it is safe to assume this Blink is now alone)
}

/**
 * Time
 */
export function millis() {
  return Date.now();
  // monotonically incrementing timer
  // remains constant in a single pass of loop()
  // i.e. millis() will return the same value at the top
  // of loop() and the bottom.
  // This does not increment while asleep.
  // The value will reset (roll over) after ~50 days.
}

export class Timer {
  __construct() {
    this.end = 0;
  }

  set(duration) {
    this.end = Date.now() + duration;
    // Duration should be set in milliseconds
    // used like this:
    // Timer myTimer;
    // myTimer.set(millisTilExpired);
  }

  isExpired() {
    return this.end >= 0 && Date.now() > this.end;
    // Check whether a timer has expired like this:
    // Timer.myTimer;
    // if ( myTimer.isExpired() ) {
    //   // the set duration has passed
    // }
  }

  getRemaining() {
    let diff = Date.now() - this.end;
    return diff > 0 ? diff : 0;
    // Returns the time remaining on the timer in milliseconds
    // Returns 0 when timer is expired
  }

  never() {
    // set the timer to never expire, like this:
    // Timer.myTimer;
    // myTimer.never();
  }
}

/**
 * Convenience
 */
export function FOREACH_FACE(func) {
  for (let i = 0; i < 6; i++) {
    func(i);
  }
  // f increments from 0-5 (i.e. each face)
}

export function COUNT_OF(array) {
  return array.length;
  // pass this export function an array and it will returns number of elements in the array
}

export function sin8_C(byte) {
  return 122.5 * Math.sin((Math.PI * 2 * byte) / 255) + 122.5;
  // pass it values from 0 - 255
  // it returns values from 0 - 255 - 0 in a sin pattern
}

export function map(value, input_min, input_max, output_min, output_max) {
  return (
    ((value - input_min) / (input_max - input_min)) * output_max + output_min
  );
  // map will translate the value from the input scale to the output scale
  // for instance, if you called map( 1, 0, 2, 0, 4) you would get 2
  // because the 1's position between 0 and 2 is equivalent to 2's position between 0 and 4
  // minimums must be smaller than maximums in both input and output
  // this export function cannot be used to map things in reverse by reversing those values
}

/**
 * Constants
 */

export const FACE_COUNT = 6;
// 6 for the number of faces the current Blinks have
// (maybe a new tesselation for heptagons will be found and we'll come out with a new version, but until then, six.)

export const MAX_BRIGHTNESS = 255;
// 255 for the highest brightness level displayed
// Note: brightness actually only has 31 different values,
// however, we scale them to 0-255 to match a familia 8-bit color scheme

export const SERIAL_NUMBER_LEN = 9;
// Length of the globally unique serial number (9 bytes long)

/**
 * Uniqueness
 */
export function random(limit) {
  return Math.round(Math.random() * limit);
  // Return a random number between 0 and limit inclusive.
}

export function randomize() {
  // Seeds the random number generator
  // If you don't call this, your random calls will be
  // the same each time you reinstall the game
}

export function getSerialNumberByte(n) {
  return _TILE.serial.charAt(n % SERIAL_NUMBER_LEN);
  // Read the unique serial number for this blink tile
  // There are 9 bytes in all, so n can be 0-8
}
