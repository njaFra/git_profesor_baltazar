export default class Utils {
  static mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  static xCameraCoordinate (value) {
    return (1 - value) > (5 / 16) ? ((1 - value) < (11 / 16) ? (1 - value - (5 / 16)) * (16 / 5) : 1) : 0;
  }

  static yCameraCoordinate (value) {
    return (value) > (2 / 9) ? (value < (7 / 9) ? (value - (2 / 9)) * (9 / 4) : 1) : 0;
  }

  static clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
}