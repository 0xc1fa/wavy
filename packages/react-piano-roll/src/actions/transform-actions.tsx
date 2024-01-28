import { PianoRollStore } from "@/store/pianoRollStore";

export type TransformAction =
  | SetPianoLaneScaleXAction
  | { type: "SET_BPM"; payload: { bpm: number } };

type SetPianoLaneScaleXAction = {
  type: "SET_PIANO_LANE_SCALE_X";
  payload: { pianoLaneScaleX: number };
};
export function setPianoLaneScaleX(
  state: PianoRollStore,
  action: SetPianoLaneScaleXAction,
) {
  return {
    ...state,
    pianoLaneScaleX: action.payload.pianoLaneScaleX,
  };
}
