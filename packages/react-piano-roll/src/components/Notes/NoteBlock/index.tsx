import React, { memo } from "react";
import styles from "./index.module.scss";
import useTheme from "../../../hooks/useTheme";
import useStore from "../../../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { baseLaneWidth } from "@/constants";

interface NoteBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  note: TrackNoteEvent;
}
function NoteBlock({ note, ...other }: NoteBlockProps) {
  const theme = useTheme();
  const { pianoRollStore } = useStore();

  return (
    <div
      aria-label="piano-roll-note"
      key={note.id}
      className={styles["note"]}
      style={
        {
          "--saturation": `${0.2 + (note.velocity / 127) * 0.8}`,
          "--top": `${pianoRollStore.getMinYFromNoteNum(note.noteNumber)}px`,
          "--left": `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
          "--note-width": `${pianoRollStore.getOffsetXFromTick(note.duration)}px`,
          "--note-height": `${baseLaneWidth}px`,
          "--background": note.isSelected ? theme.note.noteBackgroundColor : theme.note.noteBackgroundColor,
          "--border-color": note.isSelected ? theme.note.noteBorderColor : theme.note.noteBorderColor,
          "--border-radius": `${theme.note.noteBorderRadius}px`,
          outline: note.isSelected ? `3px solid #ffffff33` : "none",
        } as React.CSSProperties
      }
    />
  );
}

export default memo(NoteBlock);
