// import { useStore } from "@/hooks/useStore";
import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";
import { useRef } from "react";
import { useHandleDelete } from "./handlers/useHandleDelete";
import { useClipboardKeyboardShortcut } from "./handlers/useClipboardKeyboardShortcut";
import { useNoteSelectionHandler } from "./handlers/useNoteSelectionHandler";
import { useHandleSetVelocity } from "./handlers/useHandleSetVelocity";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/store/note";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  const notes = useAtomValue(notesAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading } = useConfig();

  useHandleDelete(containerRef);
  useClipboardKeyboardShortcut(containerRef);

  useNoteSelectionHandler(containerRef);
  const { handleSetVelocityPD, handleSetVelocityPM, handleSetVelocityPU } = useHandleSetVelocity();

  const handlers = {
    onPointerDown(event: React.PointerEvent) {
      // handleSetNoteSelectionPD(event);
      handleSetVelocityPD(event);
    },
    onPointerMove(event: React.PointerEvent) {
      handleSetVelocityPM(event);
    },
    onPointerUp(event: React.PointerEvent) {
      handleSetVelocityPU(event);
    },
  };

  return (
    <div className={styles["notes-container"]} ref={containerRef} tabIndex={0} {...handlers}>
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
