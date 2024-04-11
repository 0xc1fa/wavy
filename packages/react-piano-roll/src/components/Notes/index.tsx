import styles from "./index.module.scss";
import { useRef } from "react";
import { useDeleteHotkey } from "./handlers/useDeleteHotkey";
import { useClipboardHotkey } from "./handlers/useClipboardHotkey";
import { useNoteSelectionGesture } from "./handlers/useNoteSelectionGesture";
import { useVelocitySetterGesture } from "./handlers/useVelocitySetterGesture";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/store/note";
import Note from "./Note";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const notes = useAtomValue(notesAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useDeleteHotkey(containerRef);
  useClipboardHotkey(containerRef);
  useNoteSelectionGesture(containerRef);
  useVelocitySetterGesture(containerRef);

  return (
    <div className={styles["notes-container"]} ref={containerRef} tabIndex={0}>
      {notes.map((note) => (
        <Note note={note} attachLyric={attachLyric} key={note.id} />
      ))}
    </div>
  );
}
