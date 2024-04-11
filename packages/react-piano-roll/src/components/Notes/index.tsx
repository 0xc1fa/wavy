import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";
import { useRef } from "react";
import { useDeleteHotkey } from "./handlers/useDeleteHotkey";
import { useClipboardHotkey } from "./handlers/useClipboardHotkey";
import { useNoteSelectionGesture } from "./handlers/useNoteSelectionGesture";
import { useVelocitySetterGesture } from "./handlers/useVelocitySetterGesture";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/store/note";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const notes = useAtomValue(notesAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading } = useConfig();

  useDeleteHotkey(containerRef);
  useClipboardHotkey(containerRef);
  useNoteSelectionGesture(containerRef);
  useVelocitySetterGesture(containerRef);

  return (
    <div className={styles["notes-container"]} ref={containerRef} tabIndex={0}>
      {notes.map((note) => (
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
      ))}
    </div>
  );
}
