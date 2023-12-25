// import { TrackNoteEvent } from "@/core/Track";

export function quantizeTick(tick: number, quantize: number) {
  return Math.round(tick / quantize) * quantize;
}

// export function sortTrackNoteEvent(trackNoteEvent: TrackNoteEvent[]) {
//   return trackNoteEvent.sort((a, b) => a.tick - b.tick);
// }

export function logOffsetPos(desc: string, e: PointerEvent | MouseEvent) {
  console.log(`${desc}, X: ${e.offsetX}, Y: ${e.offsetY}`);
}

export function debug(desc: string) {
  console.log(`${desc}, ${new Date().getTime()}`);
}

export function getFrequencyFromNoteNum(noteNum: number) {
  return 440 * Math.pow(2, (noteNum - 69) / 12);
}

export function capturePointer(e: PointerEvent) {
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

export function isCapturingPointer(e: PointerEvent) {
  return (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId);
}
