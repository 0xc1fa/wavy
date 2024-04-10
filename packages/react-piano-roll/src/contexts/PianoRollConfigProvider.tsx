import { defaultProps, MidiEditorProps } from "@/components";
import type { PitchRange } from "@/types/piano-roll-range";
import { BeatPerBar, BeatUnit } from "@/types/time-signature";
import { createContext, memo, useContext } from "react";

export type TickRange = [number, number];

const PianoRollConfigContext = createContext(defaultProps);
export const ConfigProvider = memo(PianoRollConfigContext.Provider);
export function useConfig() {
  return useContext(PianoRollConfigContext);
}
