import React, { memo } from 'react';
import styles from './piano-roll-notes.module.scss'
import useTheme from "../../hooks/useTheme";
import useStore from "../../hooks/useStore";

interface PianoRollNotesProps extends React.HTMLAttributes<HTMLDivElement> {}
function PianoRollNotes({ style, ...other}: PianoRollNotesProps) {

  const theme = useTheme();
  const { pianoRollStore } = useStore();

  return (
    <div
      aria-label="piano-roll-notes"
      className={styles['note-container']}
      style={{
        '--width': pianoRollStore.laneLength,
        '--height': pianoRollStore.canvasHeight,
        ...style
      } as React.CSSProperties}
      {...other}
    >
      {pianoRollStore.pianoRollNotes.map(item =>
        <div aria-label="piano-roll-note"
          key={item.id}
          className={styles['note']}
          style={{
            '--top': `${pianoRollStore.getMinYFromNoteNum(item.noteNumber)}px`,
            '--left': `${pianoRollStore.getOffsetXFromTick(item.tick)}px`,
            '--note-width': `${pianoRollStore.getOffsetXFromTick(item.duration)}px`,
            '--note-height': `${pianoRollStore.laneWidth}px`,
            '--background': item.isSelected? theme.note.noteSelectedBackgroundColor : theme.note.noteBackgroundColor,
            '--border-color': item.isSelected? theme.note.noteSelectedBorderColor : theme.note.noteBorderColor,
            '--border-radius': `${theme.note.noteBorderRadius}px`,
          } as React.CSSProperties}
        />
      )}
    </div>
  )
}

export default memo(PianoRollNotes)