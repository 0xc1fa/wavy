import { getEndingTickFromNotes, getSelectedNotes, getStartingTickFromNotes, usePianoRollNotes } from "@/helpers/notes";
import useStore from "../../../hooks/useStore";
import styles from "./index.module.scss";
import { basePixelsPerTick } from "@/constants";

export default function SelectionRange() {
  const { pianoRollStore } = useStore();

  const pianoRollNotes = usePianoRollNotes();
  const selectedNotes = getSelectedNotes(pianoRollNotes);

  const selectionStart = getStartingTickFromNotes(selectedNotes);
  const selectionEnd = getEndingTickFromNotes(selectedNotes);
  const selectionWidth = selectionEnd - selectionStart;

  return (
    <div
      className={styles["selection--range"]}
      style={
        {
          "--left-marker-position": `${selectionStart * basePixelsPerTick * pianoRollStore.pianoLaneScaleX}px`,
          "--range-width": `${selectionWidth * basePixelsPerTick * pianoRollStore.pianoLaneScaleX}px`,
        } as React.CSSProperties
      }
    />
  );
}
