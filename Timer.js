export class Timer {
  duration = 0;
  #callback = null;
  #timeoutId = null;
  #enabled = true;
  constructor(duration, callback) {
    this.duration = duration;
    this.#callback = callback;
    this.start();
  }

  stop() {
    clearTimeout(this.#timeoutId);
    this.#timeoutId = null;
  }

  start() {
    if (!this.#canStart) {
      return;
    }
    this.#timeoutId = setTimeout(() => this.#callback(), this.duration);
  }

  restart() {
    this.stop();
    this.start();
  }

  disable() {
    this.#enabled = false;
    this.stop();
  }

  enable() {
    this.#enabled = true;
    this.start();
  }

  get #canStart() {
    return this.#enabled && this.duration > 0;
  }
}
