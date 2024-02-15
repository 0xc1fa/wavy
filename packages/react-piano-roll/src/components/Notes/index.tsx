import { useStore } from "@/hooks/useStore";
import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";
import { useRef } from "react";
import { useHandleDelete } from "./handlers/useHandleDelete";
import { useClipboard } from "./handlers/useClipboard";
import { useHandleSetNoteSelection } from "./handlers/useHandleSetNoteSelection";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const { pianoRollStore } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useHandleDelete(containerRef);
  useClipboard(containerRef);

  const { handleSetNoteSelectionPD } = useHandleSetNoteSelection()

  return (
    <div className={styles["notes-container"]} ref={containerRef} tabIndex={0} onPointerDown={handleSetNoteSelectionPD}>
      {pianoRollStore.notes.map((note) => (
        <div
          className={styles["note"]}
          data-note-id={note.id}
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
