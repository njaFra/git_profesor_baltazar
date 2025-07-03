import Engine from "@engine/Engine.js";
import SceneManager from "@engine/SceneManager.js";
import InputManager from "@engine/InputManager.js";
import AssetManager from "@engine/AssetManager.js";
import BaseScene from "@engine/BaseScene.js";

import StartMenuScene from "@scenes/StartMenuScene.js";
import DrawingScene from "@scenes/DrawingScene.js";
import MemoryGameScene from '@scenes/MemoryScene.js';

(async () => {
  const videoEl = document.querySelector("#inputVideo");

  const input = new InputManager({ videoElement: videoEl });
  const assets = new AssetManager();
  const scenes = new SceneManager();

  scenes.register("StartMenu", StartMenuScene);
  scenes.register("Drawing", DrawingScene);
  scenes.register("MemoryGame", MemoryGameScene);

  const engine = new Engine({
    sceneManager: scenes,
    inputManager: input,
    assetManager: assets,
  });
  await engine.init();

  await scenes.switch("StartMenuScene");
  engine.start();
})();
