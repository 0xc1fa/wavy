import React, { memo } from "react";
import styles from "./index.module.scss";
import useTheme from "../../../hooks/useTheme";
import useStore from "../../../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { baseLaneWidth } from "@/constants";
import { getMinYFromNoteNum, getOffsetXFromTick } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

interface NoteBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  note: TrackNoteEvent;
}
function NoteBlock({ note, ...other }: NoteBlockProps) {
  const theme = useTheme();
  const { pianoRollStore } = useStore();
  const { numOfKeys } = useConfig().pitchRange;

  return (
    <div
      aria-label="piano-roll-note"
      key={note.id}
      className={styles["note"]}
      style={
        {
          "--saturation": `${0.2 + (note.velocity / 127) * 0.8}`,
          "--top": `${getMinYFromNoteNum(numOfKeys, note.noteNumber)}px`,
          "--left": `${getOffsetXFromTick(pianoRollStore.scaleX, note.tick)}px`,
          "--note-width": `${getOffsetXFromTick(pianoRollStore.scaleX, note.duration)}px`,
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
