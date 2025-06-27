export default class BaseScene {
  constructor({ assets, input, manager }) {
    this.assets = assets;
    this.input = input;
    this.manager = manager;
    this.handCursors = new Map();
    this.handSmoothed = new Map(); 
    this.handLastSeen = new Map();
    this.cursorContainer = document.body;
    this.useColorIndicator = false;
    this.cursorOffset = () => ({ x: 0, y: 0 });

    this.MAX_MISSING_FRAMES = 5;
    this.SMOOTHING = 0.5;
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
    /*const cursor = document.createElement('img');
    cursor.classList.add('mouse_pointer');
    cursor.id = `cursor_${id}`;
    cursor.src = this.assets.images.get('cursor').src;
    Object.assign(cursor.style, {
      position: 'absolute',
      pointerEvents: 'none',
      backgroundSize: 'cover',
    });
    document.body.appendChild(cursor);
    this.handCursors.set(id, cursor);
    return cursor;*/
    const wrapper = document.createElement('div');
    wrapper.classList.add('cursor-wrapper');
    const img = document.createElement('img');
    img.classList.add('mouse_pointer');
    img.id = `cursor_${id}`;
    img.src = this.assets.images.get('cursor').src;
    Object.assign(img.style, {
      pointerEvents: 'none',
      backgroundSize: 'cover',
    });
    wrapper.appendChild(img);
    wrapper.img = img;
        const syncSize = () => {
      wrapper.style.width = `${img.clientWidth}px`;
      wrapper.style.height = `${img.clientHeight}px`;
    };
    if (img.complete) {
      syncSize();
    } else {
      img.onload = syncSize;
    }
    if (this.useColorIndicator) {
      const indicator = document.createElement('div');
      indicator.classList.add('cursor-indicator');
      wrapper.appendChild(indicator);
      wrapper.indicator = indicator;
    }
    Object.assign(wrapper.style, {
      position: 'absolute',
      pointerEvents: 'none',
      display: 'none',
    });
    this.cursorContainer.appendChild(wrapper);
    this.handCursors.set(id, wrapper);
    return wrapper;
  }

  removeCursor(id) {
    if (this.handCursors.has(id)) {
      this.handCursors.get(id).remove();
      this.handCursors.delete(id);
    }
    this.handSmoothed.delete(id);
    this.handLastSeen.delete(id);
  }

  loadStyle(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  removeStyle(link) {
    if (link && link.parentNode) link.parentNode.removeChild(link);
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

    const px = Math.min(
      window.innerWidth + cursor.clientWidth,
      window.innerWidth * state.x
    );
    const py = Math.min(
      window.innerHeight + cursor.clientHeight,
      window.innerHeight * state.y
    );

    const img = cursor.img || cursor;
    const offset = this.cursorOffset(img);
    cursor.style.display = 'block';
    cursor.style.left = `${px + offset.x}px`;
    cursor.style.top = `${py + offset.y}px`;

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