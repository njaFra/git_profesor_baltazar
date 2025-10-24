import BaseScene from '@engine/BaseScene.js';

export default class StartMenuScene extends BaseScene {
  constructor(params) {
    super(params);
    this.container = document.getElementById('gameContainer');

    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateFrameCount = this.updateFrameCount.bind(this);

    this.currentIndex = 0;
    this.lastFrameGesture = null;
  }

  async init() {    
    await this.assets.loadImage('profBaltazar','/pictures/startMenu/profBaltazarMainScreen.webp');
    await this.assets.loadImage('cursor','/pictures/starCatching/starCatchingCursor.webp');
    await this.assets.loadImage('goUp','/pictures/startMenu/like.webp');
    await this.assets.loadImage('goDown','/pictures/startMenu/dislike.webp');
    await this.assets.loadImage('click','/pictures/startMenu/click.webp');
    
    await this.assets.loadImage('crtanjeLogo','/pictures/drawingGame/icon.webp');
    await this.assets.loadImage('KSPLogo','/pictures/kspGame/icon.webp');
    await this.assets.loadImage('memoryLogo','/pictures/memoryGame/icon.webp');
    await this.assets.loadImage('labyrinthLogo','/pictures/labyrinthGame/icon.webp');
    await this.assets.loadImage('tictactoeLogo','/pictures/tictactoeGame/krizic.webp');
    await this.assets.loadImage('ninjafruitLogo','/pictures/ninjafruitGame/sword1.webp');
    await this.assets.loadImage('enigmaMachine', '/pictures/enigmaMachine/enigma.webp');

    this.games = [
      { name: "Ninja fruit", logo: this.assets.images.get('ninjafruitLogo').src, scene: "NinjaFruit" },
      { name: "Crtanje", logo: this.assets.images.get('crtanjeLogo').src, scene: "Drawing" },
      { name: "Kamen papir škare", logo: this.assets.images.get('KSPLogo').src, scene: "KSP" },
      { name: "Memory", logo: this.assets.images.get('memoryLogo').src, scene: "Memory" },
      { name: "Labirint", logo: this.assets.images.get('labyrinthLogo').src, scene: "Labirint" },
      { name: "Križić-kružić", logo: this.assets.images.get('tictactoeLogo').src, scene: "TicTacToe" },
      { name: "Enigma stroj", logo: this.assets.images.get('enigmaMachine').src, scene: "Enigma"}
    ];
    this.sceneEntryTime = performance.now();
    this.lastFrameGestures = {};

    this.styleEl = this.loadStyle("/css/Start.css");

    this.sceneEl = document.createElement('div');
    this.sceneEl.classList.add('container');
    this.sceneEl.innerHTML = `
      <div class="firstLayer layer">
        <img class="imgProfBaltazar" src="${this.assets.images.get('profBaltazar').src}" />
      </div>
      <div class="secondLayer layer">
        <div class="game-menu">
        </div>
      </div>
      <div class="thirdLayer layer">
        <table class="instructionsTable">
          <tr class="instructionsImages">
            <th><img src="${this.assets.images.get('goUp').src}" /></th>
            <th><img src="${this.assets.images.get('goDown').src}" /></th>
            <th><img src="${this.assets.images.get('click').src}" /></th>
          </tr>
          <tr class="instructionsText textStyle">
            <th>gore</th>
            <th>dolje</th>
            <th>odabir</th>
          </tr>
        </table>

      </div>
      <a href="https://www.flaticon.com/free-icons/hand" title="hand icons">Hand icons created by Ilham Fitrotul Hayat - Flaticon</a>
    `;

    this.container.appendChild(this.sceneEl);
    this.cursorContainer = this.sceneEl;

    this.input.on('move', this.handleMove);
    this.input.on('click', this.handleClick);
    this.input.on('frameCount', this.updateFrameCount);

    this.renderCards();
  }

  update(dt) {
  }

  render() {}

  updateFrameCount(){
    super.updateFrameCount();

    const timeSinceEntry = performance.now() - this.sceneEntryTime;
    if (timeSinceEntry < 500) return;

    const predictions = Array.from(this.input.handPredictions?.values() || []);
    if (!predictions.length) return;

    var interacted = false;

    predictions.forEach(pred => {
      const { gesture, x, y, i } = pred;

      if (gesture === 'Thumb_Up') {
        if (!interacted) {
          interacted = true;
          this.scrollUp();
        }
      }
      else if (gesture === 'Thumb_Down') {
        if (!interacted) {
          interacted = true;
          this.scrollDown();
        }
      } 

      this.lastFrameGestures[i] = gesture;
    });

    if(interacted) {
      this.sceneEntryTime = performance.now();
    }
  }

  async destroy() {
    this.input.off('move', this.handleMove);
    this.input.off('click', this.handleClick);
    await super.destroy();
    this.sceneEl.remove();
    this.container.innerHTML = '';
  }

  handleMove({ x, y, i }) {
    this.updateCursor(x, y, i);
  }

  handleClick({ x, y }) {
    const el = document.elementFromPoint(x * window.innerWidth, y * window.innerHeight);
      if (el && el.tagName === 'BUTTON') el.click();
  }

  renderCards() {
    const menu = this.sceneEl.querySelector('.game-menu');
    menu.innerHTML = '';

    const prev = this.games[this.currentIndex - 1];
    const curr = this.games[this.currentIndex];
    const next = this.games[this.currentIndex + 1];

    [prev, curr, next].forEach((game, idx) => {
      if (!game) return;
      const card = document.createElement('button');
      card.className = 'textStyle game-card ' + (idx === 1 ? 'active' : 'faded');
      card.innerHTML = `
        <img src="${game.logo}" alt="${game.name}">
        <span>${game.name}</span>
      `;
      if (idx === 1) {
        card.addEventListener('click', () => this.startGame(game.scene));
      }
      menu.appendChild(card);
    });
  }

  scrollUp() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCards();
    }
  }

  scrollDown() {
    if (this.currentIndex < this.games.length - 1) {
      this.currentIndex++;
      this.renderCards();
    }
  }

  startGame(sceneName) {
    this.manager.switch(sceneName);
  }
}