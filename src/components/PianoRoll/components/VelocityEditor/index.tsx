
import React, { useEffect, useState } from "react";
import { usePianoRollNotes } from "../../helpers/notes";
import useStore from "../../hooks/useStore";
import styles from './index.module.scss'

export default function VelocityEditor() {
  const { pianoRollStore } = useStore();
  const pianoRollNotes = usePianoRollNotes();
  const [isDragging, setIsDragging] = useState(false)

  const [containerHeight, setContainerHeight] = useState(200)
  const [resizeBuffer, setResizeBuffer] = useState({
    initY: 0,
    initHeight: 0,
  })

  const handlePointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    setResizeBuffer({
      initY: event.clientY,
      initHeight: containerHeight
    })
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    console.log(event.currentTarget.getClientRects()[2])
    if (isDragging) {
      setContainerHeight(resizeBuffer.initHeight - (event.clientY - resizeBuffer.initY))
    }
  }

  const handlePointerUp: React.PointerEventHandler = (event) => {
    setIsDragging(false)
  }

  return (
    <div className={styles['container']}
      style={{
        '--container-height': `${containerHeight}px`
      } as React.CSSProperties}
    >
      <div className={styles['resize-bar']}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <div className={styles['note-bar-container']}>
      {pianoRollNotes.map(note =>
        <div className={styles['note-bar']}
          style={{
            '--note-bar-left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
            '--note-bar-height': `${note.velocity / 128}`,
          } as React.CSSProperties}
        />
      )}
      </div>
    </div>
  )
}