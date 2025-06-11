export default class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.current = null;
  }

  register(name, sceneClass) {
    this.scenes.set(name, sceneClass);
  }

  init(assets, input) {
    this.assets = assets;
    this.input = input;
  }

  async switch(name) {
    if (this.current) {
      await this.current.destroy();
    }
    const SceneClass = this.scenes.get(name);
    this.current = new SceneClass({ assets: this.assets, input: this.input, manager: this });
    await this.current.init();
  }

  update(dt) {
    if (this.current) this.current.update(dt);
  }

  render() {
    if (this.current) this.current.render();
  }
}