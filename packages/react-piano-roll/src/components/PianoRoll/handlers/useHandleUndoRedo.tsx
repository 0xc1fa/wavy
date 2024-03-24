// import { PianoRollStoreAction } from "@/store/pianoRollStore";
import { redoHistoryAtom, undoHistoryAtom } from "@/store/history";
import { useSetAtom } from "jotai";
import { Dispatch, RefObject, useEffect } from "react";
// import { useStore } from "@/hooks/useStore";

export function useHandleUndoRedo<T extends HTMLElement>(ref: RefObject<T>) {
  // const { dispatch } = useStore();
  const redo = useSetAtom(redoHistoryAtom);
  const undo = useSetAtom(undoHistoryAtom);

  useEffect(() => {
    const handleUndoWarper = (event: KeyboardEvent) => {
      if (!event.shiftKey && event.code === "KeyZ") {
        event.preventDefault();
        undo();
      }
    };
    const handleRedoWarper = (event: KeyboardEvent) => {
      if (event.shiftKey && event.code === "KeyZ") {
        event.preventDefault();
        redo();
      }
    };

    ref.current!.addEventListener("keydown", handleUndoWarper);
    ref.current!.addEventListener("keydown", handleRedoWarper);

    return () => {
      ref.current!.removeEventListener("keydown", handleUndoWarper);
      ref.current!.removeEventListener("keydown", handleRedoWarper);
    };
  });
}

// function handleRedo(event: KeyboardEvent, dispatch: Dispatch<PianoRollStoreAction>) {
//   if (event.shiftKey && event.code === "KeyZ") {
//     event.preventDefault();

//     dispatch({ type: "REDO" });
//   }
// }

// function handleUndo(event: KeyboardEvent, dispatch: Dispatch<PianoRollStoreAction>) {
//   if (!event.shiftKey && event.code === "KeyZ") {
//     event.preventDefault();

//     dispatch({ type: "REDO" });
//   }
// }
