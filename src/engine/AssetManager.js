export default class AssetManager {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
  }

  async init() {
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { this.images.set(key, img); resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  getImage(key) {
    return this.images.get(key);
  }

  loadSound(key, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.oncanplaythrough = () => { this.sounds.set(key, audio); resolve(audio); };
      audio.onerror = reject;
    });
  }

  getSound(key) {
    return this.sounds.get(key);
  }
}
