import { useStore } from "@/hooks/useStore";
import _ from "lodash";


export default function usePianoRollKeyboardHandlers(onSpace?: (event: React.KeyboardEvent) => void) {
  const { dispatch } = useStore();

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.metaKey) {
      switch (event.code) {
        case "KeyZ": {
          if (event.shiftKey) {
            dispatch({ type: "REDO" });
          } else {
            dispatch({ type: "UNDO" });
          }
        }
      }
    }
  };

  return {
    onKeyDown,
  };
}
