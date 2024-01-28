import { getEndingTickFromNotes, getSelectedNotes, getStartingTickFromNotes, usePianoRollNotes } from "@/helpers/notes"
import useStore from "../../../hooks/useStore";
import styles from './index.module.scss';

export default function SelectionRange() {
  const { pianoRollStore } = useStore();
  const { pixelsPerTick } = pianoRollStore;

  const pianoRollNotes = usePianoRollNotes()
  const selectedNotes = getSelectedNotes(pianoRollNotes)

  const selectionStart = getStartingTickFromNotes(selectedNotes)
  const selectionEnd = getEndingTickFromNotes(selectedNotes)
  const selectionWidth = selectionEnd - selectionStart

  return (
    <div className={styles['selection--range']}
      style={{
        '--left-marker-position': `${selectionStart * pixelsPerTick * pianoRollStore.pianoLaneScaleX}px`,
        '--range-width': `${selectionWidth * pixelsPerTick * pianoRollStore.pianoLaneScaleX}px`
      } as React.CSSProperties}
    />
  )
}
