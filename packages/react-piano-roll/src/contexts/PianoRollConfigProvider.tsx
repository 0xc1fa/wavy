import { MidiEditorProps } from "@/components";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { BeatPerBar, BeatUnit } from "@/interfaces/time-signature";
import { createContext, memo, useContext } from "react";

export type TickRange = [number, number];

export type PianoRollConfig = {
  pitchRange: PitchRange;
  tickRange: TickRange;
  beatsPerBar?: BeatPerBar,
  beatUnit?: BeatUnit,
  rendering: boolean;
};

const defaultPianoRollConfig: PianoRollConfig = {
  pitchRange: {
    startingNoteNum: 0,
    numOfKeys: 128,
  },
  tickRange: [0, 480 * 4 * 8],
  beatsPerBar: 4,
  beatUnit: 4,
  rendering: false,
};

const PianoRollConfigContext = createContext(defaultPianoRollConfig);
export const ConfigProvider = memo(PianoRollConfigContext.Provider);
export function useConfig() {
  return useContext(PianoRollConfigContext);
}
