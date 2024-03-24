import { VibratoMode } from "./VibratoMode";

export type PianoRollNote = {
  id: string;
  tick: number;
  noteNumber: number;
  velocity: number;
  lyric: string;
  duration: number;
};
