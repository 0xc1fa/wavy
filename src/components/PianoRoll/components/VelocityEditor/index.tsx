
import { usePianoRollNotes } from "../../helpers/notes";
import useStore from "../../hooks/useStore";
import styles from './index.module.scss'

export default function VelocityEditor() {
  const { pianoRollStore } = useStore();
  const pianoRollNotes = usePianoRollNotes();
  return (
    <div className={styles['container']}>
    {pianoRollNotes.map(note =>
      <div className={styles['note-bar']}
        style={{
          '--note-bar-left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
          '--note-bar-height': `${note.velocity / 1.28}%`
        } as React.CSSProperties}
      />
    )}
    </div>
  )
}