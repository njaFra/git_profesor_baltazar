import BaseScene from '@engine/BaseScene.js';

export default class StartMenuScene extends BaseScene {
  constructor(params) {
    super(params);
    this.container = document.getElementById('gameContainer');

    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateFrameCount = this.updateFrameCount.bind(this);
  }

  async init() {    
    await this.assets.loadImage('profBaltazar','/pictures/startMenu/profBaltazarMainScreen.png');
    await this.assets.loadImage('cursor','/pictures/starCatching/starCatchingCursor.png');

    this.sceneEl = document.createElement('div');
    this.sceneEl.classList.add('container');
    this.sceneEl.innerHTML = `
      <div class="firstLayer layer">
        <img class="imgProfBaltazar" src="${this.assets.images.get('profBaltazar').src}" />
      </div>
      <div class="secondLayer layer">
        <button class="textStyle btn btnGameButtons" id="btnDrawing">Crtanje</button>
        <button class="textStyle btn btnGameButtons" id="btnStarCatching">Ulovi zvijezde</button>
        <button class="textStyle btn btnGameButtons" id="btnLabyrinth">Labirint</button>
        <button class="textStyle btn btnGameButtons" id="btnFruitCollecting">Skupi voće</button>
        <button hidden class="textStyle btn btnGameButtons" id="btnQuiz">Kviz</button>
      </div>
    `;
    this.container.appendChild(this.sceneEl);

    this.sceneEl.querySelector('#btnDrawing').addEventListener('click', () => this.manager.switch('Drawing'));
    this.sceneEl.querySelector('#btnStarCatching').addEventListener('click', () => this.manager.switch('StarCatching'));
    this.sceneEl.querySelector('#btnLabyrinth').addEventListener('click', () => this.manager.switch('Labyrinth'));
    this.sceneEl.querySelector('#btnFruitCollecting').addEventListener('click', () => this.manager.switch('FruitCollecting'));
    this.sceneEl.querySelector('#btnQuiz').addEventListener('click', () => this.manager.switch('Quiz'));

    this.input.on('move', this.handleMove);
    this.input.on('click', this.handleClick);
    this.input.on('frameCount', this.updateFrameCount);
  }

  update(dt) {
  }

  render() {}

  updateFrameCount(){
    super.updateFrameCount();

  }

  async destroy() {
    this.input.off('move', this.handleMove);
    this.input.off('click', this.handleClick);
    await super.destroy();
    this.sceneEl.remove();
  }

  handleMove({ x, y, i }) {
    this.updateCursor(x, y, i);
  }

  handleClick({ x, y }) {
    const el = document.elementFromPoint(x * window.innerWidth, y * window.innerHeight);
      if (el && el.tagName === 'BUTTON') el.click();
    }
}