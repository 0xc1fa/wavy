import React, { memo } from 'react';
import styles from './piano-roll-notes.module.scss'
import useTheme from "../../hooks/useTheme";
import useStore from "../../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";

interface PianoRollNotesProps extends React.HTMLAttributes<HTMLDivElement> {
  note: TrackNoteEvent,
}
function PianoRollNotes({ style, note, ...other }: PianoRollNotesProps) {

  const theme = useTheme();
  const { pianoRollStore } = useStore();

  return (
    <div aria-label="piano-roll-note"
      key={note.id}
      className={styles['note']}
      style={{
        '--top': `${pianoRollStore.getMinYFromNoteNum(note.noteNumber)}px`,
        '--left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
        '--note-width': `${pianoRollStore.getOffsetXFromTick(note.duration)}px`,
        '--note-height': `${pianoRollStore.laneWidth}px`,
        '--background': note.isSelected? theme.note.noteSelectedBackgroundColor : theme.note.noteBackgroundColor,
        '--border-color': note.isSelected? theme.note.noteSelectedBorderColor : theme.note.noteBorderColor,
        '--border-radius': `${theme.note.noteBorderRadius}px`,
      } as React.CSSProperties}
    />
  )
}

export default memo(PianoRollNotes)