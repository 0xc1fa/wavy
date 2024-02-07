import { PianoRollStore } from "@/store/pianoRollStore";

export type TransformAction = SetscaleXAction | { type: "SET_BPM"; payload: { bpm: number } };

type SetscaleXAction = {
  type: "SET_PIANO_LANE_SCALE_X";
  payload: { scaleX: number };
};
export function setscaleX(state: PianoRollStore, action: SetscaleXAction) {
  return {
    ...state,
    scaleX: action.payload.scaleX,
  };
}
