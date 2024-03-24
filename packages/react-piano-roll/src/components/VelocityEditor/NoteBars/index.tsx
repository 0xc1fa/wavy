import useVelocityEditorMouseHandlers from "./handlers/useVelocityEditorMouseHandlers";
import styles from "./index.module.scss";
import { getOffsetXFromTick } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";
import useTheme from "@/hooks/useTheme";
import { useAtom, useAtomValue } from "jotai";
import { notesAtom, selectedNoteIdsAtom } from "@/store/note";

type Props = {
  isDragging: boolean;
};
const NoteBars: React.FC<Props> = ({ isDragging }) => {
  const mouseHandlers = useVelocityEditorMouseHandlers();
  // const { pianoRollStore } = useStore();
  const notes = useAtomValue(notesAtom);
  const { scaleX } = useScaleX();
  const theme = useTheme();
  const [selectedNoteIds] = useAtom(selectedNoteIdsAtom)

  return (
    <div className={styles["note-bar-container"]} {...mouseHandlers}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={styles["marker-container"]}
          style={
            {
              "--marker-left": `${getOffsetXFromTick(scaleX, note.tick)}px`,
              "--marker-top": `${1 - note.velocity / 128}`,
              "--marker-width": `${getOffsetXFromTick(scaleX, note.duration)}px`,
              "--marker-color": selectedNoteIds.has(note.id) ? theme.note.noteBackgroundColor : theme.note.noteBackgroundColor,
              "--cursor": isDragging ? "grabbing" : "grab",
            } as React.CSSProperties
          }
          data-note-id={note.id}
          data-velocity={note.velocity}
        >
          <div className={styles["velocity-marker"]} data-note-id={note.id} />
          <div
            className={styles["length-marker"]}
            data-note-id={note.id}
            style={{
              outline: selectedNoteIds.has(note.id) ? `3px solid #ffffff33` : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default NoteBars;
