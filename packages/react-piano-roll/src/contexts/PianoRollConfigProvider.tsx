import type { PitchRange } from "@/interfaces/piano-roll-range";
import { createContext, memo, useContext } from "react";

export type TickRange = [number, number];

export type PianoRollConfig = {
  pitchRange: PitchRange;
  tickRange: TickRange;
};

const defaultPianoRollConfig: PianoRollConfig = {
  pitchRange: {
    startingNoteNum: 0,
    numOfKeys: 128,
  },
  tickRange: [0, 480 * 4 * 8],
};

const PianoRollConfigContext = createContext(defaultPianoRollConfig);
export const ConfigProvider = memo(PianoRollConfigContext.Provider);
export function useConfig() {
  return useContext(PianoRollConfigContext);
}
