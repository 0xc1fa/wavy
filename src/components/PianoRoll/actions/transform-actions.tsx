import { PianoRollStore } from "../store/pianoRollStore";

export type TransformAction =
  | SetPianoLaneScaleXAction
  | { type: 'setBpm', payload: { bpm: number } }


  type SetPianoLaneScaleXAction = {
    type: 'setPianoLaneScaleX',
    payload: { pianoLaneScaleX: number }
  }
  export function setPianoLaneScaleX(state: PianoRollStore, action: SetPianoLaneScaleXAction) {
    return {
      ...state,
      pianoLaneScaleX: action.payload.pianoLaneScaleX
    }
  }