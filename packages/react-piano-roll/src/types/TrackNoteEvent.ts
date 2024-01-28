import { VibratoMode } from "./VibratoMode";

export type TrackNoteEvent = {
  id: string;
  tick: number;
  noteNumber: number;
  velocity: number;
  lyric: string;
  duration: number;
  isSelected: boolean;
  isActive: boolean;
  vibratoDepth: number;
  vibratoRate: number;
  vibratoDelay: number;
  vibratoMode: VibratoMode;
};
