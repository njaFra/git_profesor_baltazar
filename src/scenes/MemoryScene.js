import BaseScene from "@engine/BaseScene.js";

export default class MemoryGameScene extends BaseScene {
  constructor(params) {
    super(params);
    this.container = document.getElementById("gameContainer");
    this.currentScreen = "start"; // start, rules, game, gameover

    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateFrameCount = this.updateFrameCount.bind(this);

    // Game state vars
    this.cards = [];
    this.flippedCards = [];
    this.matchedCards = new Set();

    this.score = 0;
    this.timeLeft = 120;

    this.timerInterval = null;
  }

  async init() {
    // Load assets for cards, buttons, etc.
    await this.assets.loadImage("backButton", "/pictures/backButton.png");
    await this.assets.loadImage(
      "cursor",
      "/pictures/starCatching/starCatchingCursor.png"
    );

    const assetImages = [
      "background_game",
      "background_instructions",
      "background_title",
    ];
    for (const name of assetImages) {
      await this.assets.loadImage(name, `/pictures/memoryGame/${name}.png`);
    }
    for (let i = 1; i <= 6; i++) {
      await this.assets.loadImage(
        `mem-card${i}`,
        `/pictures/memoryGame/memory-card${i}.png`
      );
    }

    this.input.on("move", this.handleMove);
    this.input.on("click", this.handleClick);
    this.input.on("frameCount", this.updateFrameCount);

    this.render();
  }

  startNewGame() {
    this.score = 0;
    this.timeLeft = 60;
    this.flippedCards = [];
    this.matchedCards.clear();

    // Setup or shuffle cards here
    this.setupCards();

    // Start timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.currentScreen = "gameover";
        this.gameResult = "lose";
        clearInterval(this.timerInterval);
      }
    }, 1000);

    this.currentScreen = "game";
    this.render();
  }

  setupCards() {
    // Create and shuffle your 16 cards with pairs here
  }

  handleClick({ x, y }) {
    // Depending on this.currentScreen handle button clicks or card flips
    if (this.currentScreen === "start") {
      // Check if New Game button clicked -> this.currentScreen = 'rules'
      // Check if Back button clicked -> switch to main menu scene via this.manager.switch(...)
    } else if (this.currentScreen === "rules") {
      // Handle Start Playing button and Back button similarly
    } else if (this.currentScreen === "game") {
      // Check if Give Up clicked -> this.currentScreen = 'start' (or back to main menu)
      // Detect card clicked and flip cards, check for matches, update score
    } else if (this.currentScreen === "gameover") {
      // Check buttons: New Game (restart), Main Menu (switch scene)
    }
  }

  update(dt) {}

  render() {
    if (this.sceneEl) this.sceneEl.remove();

    this.sceneEl = document.createElement("div");
    this.sceneEl.classList.add("container");

    switch (this.currentScreen) {
      case "start":
        this.renderStartScreen();
        break;
      case "rules":
        this.renderRulesScreen();
        break;
      case "game":
        this.renderGameplayScreen();
        break;
      case "gameover":
        this.renderGameOverScreen();
        break;
    }
  }

  renderStartScreen() {
    this.sceneEl.innerHTML = `<div class="firstLayer layer">
        <h1>Memory Game</h1>
    </div>
    <div class="secondLayer layer">
        <button id="btnNewGame" class="textStyle btn">New Game</button>
    </div>
    <div class="thirdlayer layer">
        <button class="btn" id="btnBack">
            <img src="${
              this.assets.images.get("backButton").src
            }" height="100%"/>
        </button>
    </div>
    `;

    this.container.appendChild(this.sceneEl);

    this.sceneEl.querySelector("#btnNewGame").addEventListener("click", () => {
      console.log("New Game clicked");
      this.currentScreen = "rules";
      this.render();
    });

    const backBtn = this.container.querySelector("#btnBack");
    backBtn.addEventListener("click", () => {
      this.manager.switch("StartMenu");
    });

    this.input.on("move", this.handleMove);
    this.input.on("click", this.handleClick);
    this.input.on("frameCount", this.updateFrameCount);
  }

  renderRulesScreen() {
    this.sceneEl.innerHTML = `<div class="memory-rules-screen">
        <h2>How to Play</h2>
        <p>Match all card pairs before time runs out!</p>
        <button id="btnStartPlaying">Start Playing</button>
        <button id="btnBack">Back</button>
    </div>`;

    this.sceneEl
      .querySelector("#btnStartPlaying")
      .addEventListener("click", () => {
        this.startNewGame();
      });

    this.btnBack.addEventListener("click", () =>
      this.manager.switch("StartMenu")
    );
  }

  renderGameplayScreen() {
    let gridHTML = "";
    for (let i = 0; i < 16; i++) {
      gridHTML += `<div class="card" data-index="${i}"></div>`;
    }

    this.sceneEl.innerHTML = `<div class="memory-game-ui">
        <div class="top-bar">
            <button id="btnGiveUp">Give Up</button>
            <div>Score: ${this.score}</div>
            <div>Time: ${this.timeLeft}</div>
        </div>
        <div class="card-grid">${gridHTML}</div>
    </div>`;

    this.sceneEl.querySelector("#btnGiveUp").addEventListener("click", () => {
      clearInterval(this.timerInterval);
      this.currentScreen = "start";
      this.render();
    });

    // Attach card click listeners later in game logic
  }

  renderGameOverScreen() {
    const message = this.gameResult === "win" ? "You Win!" : "Time's Up!";
    this.sceneEl.innerHTML = `
    <div class="memory-gameover-screen">
      <h2>${message}</h2>
      <p>Score: ${this.score}</p>
      <button id="btnRestart">New Game</button>
      <button id="btnMainMenu">Main Menu</button>
    </div>
  `;

    this.sceneEl.querySelector("#btnRestart").addEventListener("click", () => {
      this.startNewGame();
    });

    this.sceneEl.querySelector("#btnMainMenu").addEventListener("click", () => {
      this.manager.switch("StartMenu");
    });
  }

  updateFrameCount() {
    super.updateFrameCount();
  }

  async destroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.input.off("click", this.handleClick);
    this.sceneEl.remove();
    await super.destroy();
  }

  handleMove({ x, y, i }) {
    this.updateCursor(x, y, i);
  }

  handleClick({ x, y }) {
    const el = document.elementFromPoint(
      x * window.innerWidth,
      y * window.innerHeight
    );
    if (el && el.tagName === "BUTTON") el.click();
  }
}
