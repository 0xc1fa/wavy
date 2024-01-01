import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import styles from "./piano-roll-notes-lyrics.module.scss";
import useStore from "../../hooks/useStore";
import { memo } from "react";


interface PianoRollNotesLyricProps extends React.HTMLAttributes<HTMLInputElement> {
  note: TrackNoteEvent,
}
function PianoRollNotesLyric({ note, style, ...other }: PianoRollNotesLyricProps) {

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
    dispatch({ type: 'updateNoteLyric', payload: { noteId: note.id, lyric: event.target.value } })
  }

  return (
    <input type="text"
      key={note.id}
      className={styles['lyric']}
      placeholder="[no lyric]"
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

// function withNoteLyricsChanged(notes: TrackNoteEvent[], noteId: string, lyric: string) {
//   return notes.map(note => (note.id === noteId) ? { ...note, lyric: lyric } : note)
// }

export default memo(PianoRollNotesLyric)