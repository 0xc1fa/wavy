import { useEventListener } from "@/hooks/useEventListener";
import { redoHistoryAtom, undoHistoryAtom } from "@/store/history";
import { useSetAtom } from "jotai";
import { RefObject } from "react";

export function useUndoRedoHotkey<T extends HTMLElement>(ref: RefObject<T>) {
  const redo = useSetAtom(redoHistoryAtom);
  const undo = useSetAtom(undoHistoryAtom);

  useEventListener(ref, "keydown", (event) => {
    if (!event.shiftKey && event.code === "KeyZ") {
      event.preventDefault();
      undo();
    }
  });

  useEventListener(ref, "keydown", (event) => {
    if (event.shiftKey && event.code === "KeyZ") {
      event.preventDefault();
      redo();
    }
  });
}
