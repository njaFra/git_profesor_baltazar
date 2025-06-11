export default class Engine {
  constructor({ sceneManager, inputManager, assetManager }) {
    this.sceneManager = sceneManager;
    this.input = inputManager;
    this.assets = assetManager;
    this.lastTime = 0;
  }

  async init() {
    await this.input.init();
    await this.assets.init();
    this.sceneManager.init(this.assets, this.input);
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(now) {
    const dt = now - this.lastTime;
    this.input.update();
    this.sceneManager.update(dt);
    this.sceneManager.render();
    this.lastTime = now;
    requestAnimationFrame(this.loop.bind(this));
  }
}