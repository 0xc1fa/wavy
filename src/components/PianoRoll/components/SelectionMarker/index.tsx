import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface SelectionMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function SelectionMarker({  }: SelectionMarkerProps) {
  const { pianoRollStore } = useStore();
  const { pixelsPerTick } = pianoRollStore;

  // const className =
  //   pianoRollStore.selectionRange.mode === 'range' ?
  //   `${styles['selection']} ${styles['selection--range']}` :
  //   `${styles['selection']} ${styles['selection--point']}`

  const selectedNotes = pianoRollStore.pianoRollNotes.filter(note => note.isSelected)
  const haveSelection = selectedNotes.length > 1
  if (!haveSelection) return (<></>)
  const selectionStart = selectedNotes.reduce((min, note) => Math.min(min, note.tick), Infinity)
  const selectionEnd = selectedNotes.reduce((max, note) => Math.max(max, note.tick + note.duration), -Infinity)
  const selectionWidth = selectionEnd - selectionStart

  return (
    <div className={styles['selection']}
      style={{
        '--left-marker-position': `${selectionStart * pixelsPerTick}px`,
        '--selection-width': `${selectionWidth * pixelsPerTick}px`
      } as React.CSSProperties}
    />
  )
}
