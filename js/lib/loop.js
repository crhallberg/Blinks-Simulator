/**
 * https://github.com/straker/kontra/blob/master/src/gameLoop.js
 */
export default function GameLoop({ fps = 60, update, render } = {}) {
  // animation variables
  let accumulator = 0;
  let delta = 1e3 / fps; // delta between performance.now timings (in ms)
  let step = 1 / fps;
  let last, rAF, now, dt, loop;

  /**
   * Called every frame of the game loop.
   */
  function frame() {
    rAF = requestAnimationFrame(frame);

    now = performance.now();
    dt = now - last;
    last = now;

    // prevent updating the game with a very large dt if the game were to lose focus
    // and then regain focus later
    if (dt > 1e3) {
      return;
    }

    accumulator += dt;

    while (accumulator >= delta) {
      loop.update(step);

      accumulator -= delta;
    }

    loop.render();
  }

  // game loop object
  loop = {
    update,
    render,
    isStopped: true,
    start() {
      last = performance.now();
      this.isStopped = false;
      requestAnimationFrame(frame);
    },
    stop() {
      this.isStopped = true;
      cancelAnimationFrame(rAF);
    }
  };

  return loop;
}