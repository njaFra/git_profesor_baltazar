import { Camera } from '@mediapipe/camera_utils';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import Utils from './Utils';
import BaseScene from './BaseScene';

export default class InputManager {
  constructor({ videoElement }) {
    this.video = videoElement;
    this.handlers = { move: [], click: [] };
    this.lastVideoTime = -1;
  }

  async init() {
    const wasmFileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');

    const gestureOptions = {
      baseOptions: { 
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
        delegate: "GPU"
      },
      runningMode: 'VIDEO',
      numHands: 4,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    };
    this.gestureRecognizer = await GestureRecognizer.createFromOptions(wasmFileset, gestureOptions);

    this.camera = new Camera(this.video, {
      onFrame: async () => {},
      width: 320,
      height: 240
    });
    this.camera.start();

    await new Promise(resolve => {
      this.video.addEventListener('playing', () => {
        resolve();
      }, { once: true });
    });

    requestAnimationFrame(this._detectionLoop.bind(this));
  }

  _detectionLoop() {
    if (!this.video.videoWidth || !this.video.videoHeight) {
      return requestAnimationFrame(this._detectionLoop.bind(this));
    }

    const now = performance.now();
    const results = this.gestureRecognizer.recognizeForVideo(this.video, now);

    if (results.gestures?.length) {
      for (let i = 0; i < results.gestures.length; i++) {
          const landmarks = results.landmarks[i];
          if (landmarks && landmarks[8]) {
              const handId = `cursor_${i}`;
              const x = Utils.xCameraCoordinate(landmarks[8].x);
              const y = Utils.yCameraCoordinate(landmarks[8].y);
              this.emit('move', { x, y, i });

              const mouseGesture = results.gestures[i][0].categoryName;
              if (mouseGesture === "Pointing_Up" && this.lastGesture !== "Pointing_Up") {
                this.emit('click', { x: x, y: y });
              }
              this.lastGesture = mouseGesture;
          }
      }
    }

    this.emit('frameCount');

    requestAnimationFrame(this._detectionLoop.bind(this));
  }

  update() {
  }

  on(event, handler) {
    (this.handlers[event] = this.handlers[event] || []).push(handler);
  }

  off(event, handler) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  }

  emit(event, data) {
    (this.handlers[event] || []).forEach(h => h(data));
  }
}
