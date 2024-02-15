import { PianoRollStoreAction } from "@/store/pianoRollStore";
import { Dispatch, RefObject, useEffect } from "react";
import { useStore } from "@/hooks/useStore";

export function useHandleUndoRedo<T extends HTMLElement>(ref: RefObject<T>) {
  const { dispatch } = useStore();

  useEffect(() => {
    const handleUndoWarper = (event: KeyboardEvent) => handleUndo(event, dispatch);
    const handleRedoWarper = (event: KeyboardEvent) => handleRedo(event, dispatch);

    ref.current!.addEventListener("keydown", handleUndoWarper);
    ref.current!.addEventListener("keydown", handleRedoWarper);

    return () => {
      ref.current!.removeEventListener("keydown", handleUndoWarper);
      ref.current!.removeEventListener("keydown", handleRedoWarper);
    };
  });
}

function handleRedo(event: KeyboardEvent, dispatch: Dispatch<PianoRollStoreAction>) {
  if (event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    console.log("redo");
    dispatch({ type: "REDO" });
  }
}

function handleUndo(event: KeyboardEvent, dispatch: Dispatch<PianoRollStoreAction>) {
  if (!event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    console.log("undo");
    dispatch({ type: "REDO" });
  }
}
