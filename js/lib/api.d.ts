/**
 * Display
 */
declare function setColor(color: Color): void;
// sets all 6 pixels on all faces to the same Color

declare function setColorOnFace(color: Color, face: number): void;
// sets a single pixel on a face (0-5) to this Color

/**
 * Colors
 */

declare interface Color {
  hue: number;
  saturation: number;
  brightness: number;
  alpha?: number;
}

// R, G, and B values [0-255]
declare function makeColorRGB(red: number, green: number, blue: number): Color;

// H, S, and V values [0-255]
declare function makeColorHSB(
  hue: number,
  saturation: number,
  brightness: number
): Color;

declare function dim(color: Color, value: number): Color;
// returns the color passed in a dimmer state
//(0-255 bucketed into 32 levels of brightness)

declare const RED = makeColorRGB(255, 0, 0);
declare const ORANGE = makeColorRGB(255, 127, 0);
declare const YELLOW = makeColorRGB(255, 255, 0);
declare const GREEN = makeColorRGB(0, 255, 0);
declare const CYAN = makeColorRGB(0, 255, 255);
declare const BLUE = makeColorRGB(0, 0, 255);
declare const MAGENTA = makeColorRGB(255, 0, 255);
declare const WHITE = makeColorRGB(255, 255, 255);
declare const OFF = makeColorRGB(0, 0, 0);

/**
 * Button
 *
 * All button handling is done with flags, so when
 * you call a function, it returns the value of
 * the flag (i.e. whether or not that action
 * has occured) and only when you have
 * called the function will it reset
 * the flag to false
 */

declare function buttonPressed(): boolean;
// a flag is set to true on the change from button up to button down
// buttonPressed() returns that flag and sets it back to false

declare function buttonReleased(): boolean;
// a flag is set to true on the change from button
// down to button up buttonReleased() returns that
// flag and sets it back to false

declare function buttonSingleClicked(): boolean;
// a flag is set to true when the the
// button goes from down to up
// only once in under 330ms. The flag is set exactly
// 330ms after the button is up
// buttonSingleClicked() returns that flag and sets it back to false

declare function buttonDoubleClicked(): boolean;
// returns true when a double click has been recorded
// (down-up-down-up under 330ms*)
// ^ also a flag with the same properties as above

declare function buttonMultiClicked(): boolean;
// returns true when multiple click has been recorded
// (down-up...down-up under 330ms*)
// ^ also a flag with the same properties as above

declare function buttonClickCount(): number;
return 0;
// returns the number of clicks recorded during button multi clicking

declare function buttonLongPressed(): boolean;
return false;
// returns true when the button has been down for more than 3000ms (3 seconds)
// ^ also a flag with the same properties as above

declare function buttonDown(): boolean;
return false;
// returns true when the button is down
// ^ also a flag with the same properties as above

/**
 * Communication
 */
declare function setValueSentOnAllFaces(value: number): void;
// sets a value (0-63) to be sent
// repeatedly (every loop() cycle) on all 6 faces

declare function setValueSentOnFace(value: number, face: number): void;
// sets a value (0-63) to be sent repeatedly (every loop() cycle)
// on the face specified

declare function getLastValueReceivedOnFace(face: number): number;
// retreives the last value seen on the
// specified face even if expired
// (i.e. last message from neighbor)
// defaults to 0 on startup

declare function isValueReceivedOnFaceExpired(face: number): boolean;
// returns true if the message from a
// neighbor has expired
// (i.e. it's been longer than 200ms since we last
// received a message from this neighbor)

declare function didValueOnFaceChange(face: number): boolean;
// returns true if the value on this face is different
// from the last stored seen value on this face

declare function isAlone(): boolean;
// returns true if all faces have expired values
// (i.e. it is safe to assume this Blink is now alone)

/**
 * Time
 */
declare function millis(): number;
// monotonically incrementing timer
// remains constant in a single pass of loop()
// i.e. millis() will return the same value at the top
// of loop() and the bottom.
// This does not increment while asleep.
// The value will reset (roll over) after ~50 days.

declare class Timer {
  private end: number;

  set(duration: number): void;
  // Duration should be set in milliseconds
  // used like this:
  // Timer myTimer;
  // myTimer.set(millisTilExpired);

  isExpired(): boolean;
  // Check whether a timer has expired like this:
  // Timer.myTimer;
  // if ( myTimer.isExpired() ) {
  //   // the set duration has passed
  // }

  getRemaining(): number;
  // Returns the time remaining on the timer in milliseconds
  // Returns 0 when timer is expired

  never(): void;
  // set the timer to never expire, like this:
  // Timer.myTimer;
  // myTimer.never();
}

/**
 * Convenience
 */
declare function FOREACH_FACE(func: (f: number) => void): void;
// f increments from 0-5 (i.e. each face)

declare function COUNT_OF(array: any[]): number;
// pass this function an array and it will returns number of elements in the array

declare function sin8_C(byte: number): number;
// pass it values from 0 - 255
// it returns values from 0 - 255 - 0 in a sin pattern

declare function map(
  value: number,
  input_min: number,
  input_max: number,
  output_min: number,
  output_max: number
): number;
// map will translate the value from the input scale to the output scale
// for instance, if you called map( 1, 0, 2, 0, 4) you would get 2
// because the 1's position between 0 and 2 is equivalent to 2's position between 0 and 4
// minimums must be smaller than maximums in both input and output
// this function cannot be used to map things in reverse by reversing those values

/**
 * Constants
 */

declare const FACE_COUNT = 6;
// 6 for the number of faces the current Blinks have
// (maybe a new tesselation for heptagons will be found and we'll come out with a new version, but until then, six.)

declare const MAX_BRIGHTNESS = 255;
// 255 for the highest brightness level displayed
// Note: brightness actually only has 31 different values,
// however, we scale them to 0-255 to match a familia 8-bit color scheme

declare const SERIAL_NUMBER_LEN = 9;
// Length of the globally unique serial number (9 bytes long)

/**
 * Uniqueness
 */
declare function random(limit: number): number;
// Return a random number between 0 and limit inclusive.

declare function randomize(): void;
// Seeds the random number generator
// If you don't call this, your random calls will be
// the same each time you reinstall the game

declare function getSerialNumberByte(/*byte*/ n: number): number;
// Read the unique serial number for this blink tile
// There are 9 bytes in all, so n can be 0-8
