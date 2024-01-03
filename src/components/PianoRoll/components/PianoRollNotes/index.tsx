import useStore from "../../hooks/useStore";
import PianoRollNoteBlock from "../PianoRollNoteBlock";
import PianoRollNoteLyric from "../PianoRollNoteLyric";
import styles from "./index.module.scss";

export default function PianoRollNotes(
  { lyric = false }: { lyric?: boolean }
) {

  const { pianoRollStore } = useStore()

  return (
    <div className={styles['notes-container']}>
    {pianoRollStore.pianoRollNotes.map(note =>
      <div className={styles['note']}>
        <PianoRollNoteBlock note={note} />
        {lyric && <PianoRollNoteLyric note={note} />}
      </div>
    )}
    </div>
  )
}