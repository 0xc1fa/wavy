import { useContext, useMemo } from "react";
import { PianoRollStoreContext } from "../store/pianoRollStore";

export function usePianoRollTransform() {
  const context = useContext(PianoRollStoreContext);

  if (!context) {
    throw new Error("usePianoRollNotes must be used within a PianoRollStoreProvider");
  }

  const { pianoRollStore } = context;

  return useMemo(() => ({
    laneLength: pianoRollStore.laneLength,
    canvasWidth: pianoRollStore.canvasWidth,
    laneWidth: pianoRollStore.laneWidth,
    canvasHeight: pianoRollStore.canvasHeight,
    pixelPerBeat: pianoRollStore.pixelPerBeat,
    pianoLaneScaleX: pianoRollStore.pianoLaneScaleX,
    startingNoteNum: pianoRollStore.startingNoteNum,
    numOfKeys: pianoRollStore.numOfKeys,
    resolution: pianoRollStore.resolution,
    clearCanvas: pianoRollStore.clearCanvas,
    getMaxYFromNoteNum: pianoRollStore.getMaxYFromNoteNum,
  }), [pianoRollStore.laneLength, pianoRollStore.canvasHeight, pianoRollStore.pianoLaneScaleX]);
}