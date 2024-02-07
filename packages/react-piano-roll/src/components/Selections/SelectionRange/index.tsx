import { getEndingTickFromNotes, getSelectedNotes, getStartingTickFromNotes, useNotes } from "@/helpers/notes";
import useStore from "../../../hooks/useStore";
import styles from "./index.module.scss";
import { basePixelsPerTick } from "@/constants";
import { useScaleX } from "@/contexts/ScaleXProvider";

export default function SelectionRange() {
  const { scaleX } = useScaleX()

  const notes = useNotes();
  const selectedNotes = getSelectedNotes(notes);

  const selectionStart = getStartingTickFromNotes(selectedNotes);
  const selectionEnd = getEndingTickFromNotes(selectedNotes);
  const selectionWidth = selectionEnd - selectionStart;

  return (
    <div
      className={styles["selection--range"]}
      style={
        {
          "--left-marker-position": `${selectionStart * basePixelsPerTick * scaleX}px`,
          "--range-width": `${selectionWidth * basePixelsPerTick * scaleX}px`,
        } as React.CSSProperties
      }
    />
  );
}
