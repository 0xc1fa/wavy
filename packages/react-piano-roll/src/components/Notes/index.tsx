import { useStore } from "@/hooks/useStore";
import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles["notes-container"]}>
      {pianoRollStore.notes.map((note) => (
        <div
          className={styles["note"]}
          data-note-num={note.noteNumber}
          data-start-time={note.tick}
          data-duration={note.duration}
          data-velocity={note.velocity}
          key={note.id}
        >
          <NoteBlock note={note} />
          {attachLyric && <NoteLyric note={note} />}
        </div>
      ))}
    </div>
  );
}
