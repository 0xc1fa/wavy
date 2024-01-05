
import React, { useEffect, useState } from "react";
import { usePianoRollNotes } from "../../helpers/notes";
import useStore from "../../hooks/useStore";
import styles from './index.module.scss'
import LaneGrids from "../LaneGrids";

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
        <div className={styles['marker-container']}
          style={{
            '--marker-left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
            '--marker-top': `${note.velocity / 128}`,
            '--marker-width': `${pianoRollStore.getOffsetXFromTick(note.duration)}px`,
          } as React.CSSProperties}
        >
          <div className={styles['velocity-marker']} />
          <div className={styles['length-marker']} />
        </div>
      )}
      </div>
      <LaneGrids style={{ zIndex: -100 }} />
    </div>
  )
}