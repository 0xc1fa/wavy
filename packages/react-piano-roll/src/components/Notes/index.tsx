
import { useStore } from "@/hooks/useStore";
import Note from "./Note";
import styles from "./index.module.scss";


export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles["notes-container"]}>
      {pianoRollStore.notes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
    </div>
  );
}
