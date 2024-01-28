import { useContext, useMemo } from "react";
import { PianoRollStoreContext } from "../store/pianoRollStore";

export function usePianoRollDispatch() {
  const context = useContext(PianoRollStoreContext);

  if (!context) {
    throw new Error("usePianoRollNotes must be used within a PianoRollStoreProvider");
  }

  const { dispatch } = context;

  return useMemo(() => dispatch, [dispatch]);
}