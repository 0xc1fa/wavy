import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { PianoRollNote } from "@/types";
import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";

export default function Note({ attachLyric, note }: { attachLyric?: boolean; note: PianoRollNote }) {
  const { loading } = useConfig();

  return (
    <div
      className={styles["note"]}
      data-note-id={note.id}
      data-note-num={note.noteNumber}
      data-start-time={note.tick}
      data-duration={note.duration}
      key={note.id}
      style={{ opacity: loading ? 0.55 : 1 }}
    >
      <NoteBlock note={note} />
      {attachLyric && <NoteLyric note={note} />}
    </div>
  );
}
