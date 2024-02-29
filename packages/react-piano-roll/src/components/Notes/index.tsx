// import { useStore } from "@/hooks/useStore";
import NoteBlock from "./NoteBlock";
import NoteLyric from "./NoteLyric";
import styles from "./index.module.scss";
import { useRef } from "react";
import { useHandleDelete } from "./handlers/useHandleDelete";
import { useClipboard } from "./handlers/useClipboard";
import { useHandleSetNoteSelection } from "./handlers/useHandleSetNoteSelection";
import { useHandleSetVelocity } from "./handlers/useHandleSetVelocity";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/atoms/note";

export default function Notes({ attachLyric }: { attachLyric?: boolean }) {
  // const { pianoRollStore } = useStore();
  const notes = useAtomValue(notesAtom)
  const containerRef = useRef<HTMLDivElement>(null);

  useHandleDelete(containerRef);
  useClipboard(containerRef);

  const { handleSetNoteSelectionPD } = useHandleSetNoteSelection();
  const { handleSetVelocityPD, handleSetVelocityPM, handleSetVelocityPU } = useHandleSetVelocity();

  const handlers = {
    onPointerDown(event: React.PointerEvent) {
      handleSetNoteSelectionPD(event);
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
