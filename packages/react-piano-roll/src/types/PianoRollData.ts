import { PianoRollNote } from "./PianoRollNote";

export type PianoRollData = {
  notes: (PianoRollNote & { isSelected: boolean })[];
  bpm: number;
}
