import BaseScene from '@engine/BaseScene.js';

export default class DrawingScene extends BaseScene {
  constructor(params) {
    super(params);
    this.container = document.getElementById('gameContainer');

    this.drawing = false;
    this.prevPos = null;
    this.color = 'black';
    this.lineWidth = 10;
  }

  async init() {
    await this.assets.loadImage('backButton','/pictures/backButton.png');

    this.sceneEl = document.createElement('div');
    this.sceneEl.classList.add('container');
    this.sceneEl.innerHTML = `
      <div class="firstLayer layer">
        <button class="btn" id="btnBack"><img src="${this.assets.images.get('backButton').src}" height="100%"/></button>
      </div>
      <div class="secondLayer layer">
        <button class="btnSecondLayer textStyle btn" id="btnClearBackground">Očisti pozadinu</button>
      </div>
      <div class="thirdLayer layer">
        <canvas class="output_canvas"></canvas>
      </div>
      <div class="fourthLayer">
        <button class="colourPicker btn" style="background: #008801" id="btnGreen"></button>
        <button class="colourPicker btn" style="background: #0000FE" id="btnBlue"></button>
        <button class="colourPicker btn" style="background: #FE0000" id="btnRed"></button>
        <button class="colourPicker btn" style="background: #FFFF01" id="btnYellow"></button>
        <button class="colourPicker btn" style="background: white" id="btnWhite"></button>
        <button class="colourPicker btn" style="background: black" id="btnBlack"></button>
        <button class="colourPicker btn" style="background: linear-gradient(90deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)" id="btnRGBPicker"></button> 
      </div>
    `;
    this.container.appendChild(this.sceneEl);

    this.canvasElement = this.sceneEl.querySelector('.output_canvas');
    this.canvasCtx = this.canvasElement.getContext('2d');
    this.btnBack = this.sceneEl.querySelector('#btnBack');
    this.btnClearBackground = this.sceneEl.querySelector('#btnClearBackground');
    this.colorButtons = {
      green: this.sceneEl.querySelector('#btnGreen'),
      blue: this.sceneEl.querySelector('#btnBlue'),
      red: this.sceneEl.querySelector('#btnRed'),
      yellow: this.sceneEl.querySelector('#btnYellow'),
      white: this.sceneEl.querySelector('#btnWhite'),
      black: this.sceneEl.querySelector('#btnBlack')
    };

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));

    this.btnBack.addEventListener('click', ()=>this.manager.switch('StartMenu'));
    this.btnClearBackground.addEventListener('click', ()=>this.canvasCtx.clearRect(0,0,this.canvasElement.width,this.canvasElement.height));
    Object.entries(this.colorButtons).forEach(([name, btn])=>{
      btn.style.background = name;
      btn.addEventListener('click', ()=>{ this.color = name; this.canvasCtx.strokeStyle = this.color; });
    });

    this.input.on('move', ({x,y,i})=>{
      const xPx = x * this.canvasElement.clientWidth;
      const yPx = y * this.canvasElement.clientHeight;
      if(this.drawing && this.prevPos){
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(this.prevPos.x, this.prevPos.y);
        this.canvasCtx.lineTo(xPx, yPx);
        this.canvasCtx.strokeStyle = this.color;
        this.canvasCtx.lineWidth = this.lineWidth;
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
      }
      this.prevPos = { x: xPx, y: yPx };
    });

    this.input.on('click', ({x,y})=>{
      this.drawing = !this.drawing;
      if(this.drawing) this.prevPos = { x: x*this.canvasElement.clientWidth, y: y*this.canvasElement.clientHeight };
    });
  }

  update(dt) {}

  render() {}

  async destroy() {
    window.removeEventListener('resize', this.resize.bind(this));
    this.sceneEl.remove();
  }

  resize() {
    this.canvasElement.width = this.container.clientWidth * 0.96;
    this.canvasElement.height = this.container.clientHeight * 0.7;
  }
}
