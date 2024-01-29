import { PianoRollStore } from "@/store/pianoRollStore";

export type MetaAction =
  | SetClipSpanAction

type SetClipSpanAction = {
  type: "SET_CLIP_SPAN";
  payload: { startingTick: number; endingTick: number };
};
export function setClipSpan(state: PianoRollStore, action: SetClipSpanAction) {
  return {
    ...state,
    startingTick: action.payload.startingTick,
    endingTick: action.payload.endingTick,
  };
}
