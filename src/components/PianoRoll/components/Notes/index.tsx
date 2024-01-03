import useStore from "../../hooks/useStore";
import NoteBlock from "../NoteBlock";
import NoteLyric from "../NoteLyric";
import styles from "./index.module.scss";

export default function Notes(
  { lyric = false }: { lyric?: boolean }
) {

  const { pianoRollStore } = useStore()

  return (
    <div className={styles['notes-container']}>
    {pianoRollStore.pianoRollNotes.map(note =>
      <div className={styles['note']}
        data-note-num={note.noteNumber}
        data-start-time={note.tick}
        data-duration={note.duration}
        data-velocity={note.velocity}
      >
        <NoteBlock note={note} />
        {lyric && <NoteLyric note={note} />}
      </div>
    )}
    </div>
  )
}