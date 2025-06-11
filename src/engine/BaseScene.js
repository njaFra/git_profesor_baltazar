export default class BaseScene {
  constructor({ assets, input, manager }) {
    this.assets = assets;
    this.input = input;
    this.manager = manager;
    this.handCursors = new Map();
    this.handSmoothed = new Map(); 
    this.handLastSeen = new Map();

    this.MAX_MISSING_FRAMES = 5;
    this.SMOOTHING = 0.35;
    this.frameCount = 0;
  }

  updateFrameCount(){
    this.frameCount ++;
    this.handCursors.forEach((_, id) => {
      if (this.frameCount - (this.handLastSeen.get(id) || 0) > this.MAX_MISSING_FRAMES) {
        this.removeCursor(id);
      }
    });
  }

  createCursor(id) {
    const cursor = document.createElement('img');
    cursor.classList.add('cursor');
    cursor.id = `cursor_${id}`;
    cursor.src = this.assets.images.get('cursor').src;
    Object.assign(cursor.style, {
      position: 'absolute',
      pointerEvents: 'none',
      display: 'none'
    });
    document.body.appendChild(cursor);
    this.handCursors.set(id, cursor);
    return cursor;
  }

  removeCursor(id) {
    if (this.handCursors.has(id)) {
      this.handCursors.get(id).remove();
      this.handCursors.delete(id);
    }
    this.handSmoothed.delete(id);
    this.handLastSeen.delete(id);
  }

  updateCursor(xNorm, yNorm, id) {
    if (!this.handCursors.has(id)) {
      this.createCursor(id);
      this.handSmoothed.set(id, { x: xNorm, y: yNorm });
    }

    const cursor = this.handCursors.get(id);
    const state = this.handSmoothed.get(id);

    state.x += (xNorm - state.x) * this.SMOOTHING;
    state.y += (yNorm - state.y) * this.SMOOTHING;

    const px = Math.min(window.innerWidth  + cursor.clientWidth,  window.innerWidth  * xNorm);
    const py = Math.min(window.innerHeight + cursor.clientHeight, window.innerHeight * yNorm);
    cursor.style.display = 'block';
    cursor.style.left = `${px}px`;
    cursor.style.top = `${py}px`;

    this.handLastSeen.set(id, this.frameCount);
  }

  async init() {}

  update(dt) {
  }

  render() {}

  async destroy() {
    this.handCursors.forEach((c) => c.remove());
    this.handCursors.clear();
  }
}