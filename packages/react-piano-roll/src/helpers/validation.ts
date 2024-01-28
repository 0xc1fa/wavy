import { quantizeTick } from "./utility";

export function isBlackKey(keyNum: number) {
  const colors = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  return colors[keyNum % colors.length];
}

export function nearQuantizeBoundary(tick: number, quantize: number) {
  return Math.abs(tick - quantizeTick(tick, quantize)) < quantize / 10;
}
