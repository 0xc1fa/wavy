import { quantizeTick } from "./utility";

export function isBlackKey(keyNum: number): boolean {
  const colors = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  return !!colors[keyNum % 12];
}

export function nearQuantizeBoundary(tick: number, quantize: number) {
  return Math.abs(tick - quantizeTick(tick, quantize)) < quantize / 10;
}
