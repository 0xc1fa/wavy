import useStore from "@/hooks/useStore";
import styles from "./index.module.scss";
import { basePixelsPerTick } from "@/constants";
import { baseCanvasHeight } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getEndingTickFromNotes, getSelectionRangeWithSelectedNotes, getStartingTickFromNotes } from "@/helpers/notes";

export default function SelectionPoint() {
  const { pianoRollStore } = useStore();
  const { scaleX } = useScaleX();

  const { numOfKeys } = useConfig().pitchRange;
  let selectionTicks = pianoRollStore.selectionTicks;
  if (selectionTicks instanceof Array) {
    selectionTicks = getSelectionRangeWithSelectedNotes(pianoRollStore.notes.filter(note => note.isSelected), selectionTicks);
  }

  const selectionLines = () => {
    if (selectionTicks === null) {
      return null;
    } else if (selectionTicks instanceof Array) {
      const startingX = selectionTicks[0] * basePixelsPerTick * scaleX;
      const endingX = selectionTicks[1] * basePixelsPerTick * scaleX;
      return (
        <>
          <line
            x1={startingX}
            y1={0}
            x2={startingX}
            y2={baseCanvasHeight(numOfKeys)}
            stroke="#ffffff22"
            strokeWidth="1"
          />
          <line x1={endingX} y1={0} x2={endingX} y2={baseCanvasHeight(numOfKeys)} stroke="#ffffff22" strokeWidth="1" />
        </>
      );
    } else {
      const x = selectionTicks * basePixelsPerTick * scaleX;
      return <line x1={x} y1={0} x2={x} y2={baseCanvasHeight(numOfKeys)} stroke="#ffffff22" strokeWidth="1" />;
    }
  };

  return (
    <svg
      className={styles["selection--point"]}
      aria-label="pianoroll-grids"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {selectionLines()}
    </svg>
  );
}
