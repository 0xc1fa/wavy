import { useStore } from "@/hooks/useStore";
import styles from "./index.module.scss";
import { basePixelsPerTick } from "@/constants";
import { baseCanvasHeight } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getEndingTickFromNotes, getSelectionRangeWithSelectedNotes, getStartingTickFromNotes } from "@/helpers/notes";

export default function Marker() {
  const { pianoRollStore } = useStore();
  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;

  if (pianoRollStore.selectionTicks === null) {
    return null;
  }

  const x = pianoRollStore.selectionTicks * basePixelsPerTick * scaleX;

  return (
    <svg
      className={styles["selection--point"]}
      aria-label="pianoroll-grids"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <line x1={x} y1={0} x2={x} y2={baseCanvasHeight(numOfKeys)} stroke="#ffffff22" strokeWidth="1" />
    </svg>
  );
}
