
import { useEffect, useState } from "react";
import { usePianoRollNotes } from "../../helpers/notes";
import useStore from "../../hooks/useStore";
import styles from './index.module.scss'

export default function VelocityEditor() {
  const { pianoRollStore } = useStore();
  const pianoRollNotes = usePianoRollNotes();
  // const

  const [containerHeight, setContainerHeight] = useState(200)

  const handlerPointerDown: React.PointerEventHandler = (event) => {
    const offsetY = event.nativeEvent.offsetY
    const isAtTop = offsetY < 20
    if (isAtTop) {

    }
  }

  return (
    <div className={styles['container']}>
      <div className={styles['resize-bar']} />
    {pianoRollNotes.map(note =>
      <div className={styles['note-bar']}
        style={{
          '--note-bar-left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
          '--note-bar-height': `${note.velocity / 1.28}%`,
          '--container-height': `${containerHeight}px`

        } as React.CSSProperties}
      />
    )}
    </div>
  )
}