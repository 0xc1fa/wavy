// import { Component, For, batch } from "solid-js";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
// import { styled } from "solid-styled-components";
import styles from "./piano-roll-notes-lyrics.module.scss";
import useStore from "../../hooks/useStore";
import { memo } from "react";

interface PianoRollNotesLyricsProps extends React.HTMLAttributes<HTMLDivElement> {}
function PianoRollNotesLyrics({ style, ...other }: PianoRollNotesLyricsProps) {

  const { pianoRollStore } = useStore();

  console.log(pianoRollStore.pianoRollNotes)

  return (
    <div aria-label="piano-roll-notes-lyrics"
      className={styles['lyric-container']}
      style={{
        '--width': pianoRollStore.laneLength,
        '--height': pianoRollStore.canvasHeight,
        ...style,
      } as React.CSSProperties}
      {...other}
    >
      {pianoRollStore.pianoRollNotes.map(note =>
        <Lyric key={note.id} note={note} />
      )}
    </div>
  )
}

interface LyricProps extends React.HTMLAttributes<HTMLInputElement> {
  note: TrackNoteEvent,
}
function Lyric({ note, style, ...other }: LyricProps) {

  const { pianoRollStore, dispatch } = useStore();

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const target = event.currentTarget as HTMLInputElement
    const trimValue = () => { target.value = target.value.trim() }
    const getTargetId = () => { return target.dataset.index! }
    const applyChanges = () => {
      const id = getTargetId();
      dispatch({ type: 'updateNoteLyric', payload: { noteId: id, lyric: target.value } })
    }
    trimValue();
    applyChanges();
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  }

  return (
    <input type="text"
      className={styles['lyric']}
      style={{
        '--top': `${pianoRollStore.getMinYFromNoteNum(note.noteNumber)}px`,
        '--left': `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
        '--width': `${pianoRollStore.getOffsetXFromTick(note.duration)}px`,
        '--height': `${pianoRollStore.laneWidth}px`,
        ...style,
      } as React.CSSProperties}
      value={note.lyric} onBlur={handleBlur} onKeyDown={handleKeyPress} onChange={onChange}
      {...other}
    />
  )
};

function withNoteLyricsChanged(notes: TrackNoteEvent[], noteId: string, lyric: string) {
  return notes.map(note => (note.id === noteId) ? { ...note, lyric: lyric } : note)
}

export default memo(PianoRollNotesLyrics)