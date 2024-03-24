import React, { memo, useEffect } from "react";
import styles from "./index.module.scss";
import useTheme from "../../../hooks/useTheme";
// import { useStore } from "@/hooks/useStore";
import { PianoRollNote } from "@/types/PianoRollNote";
import { baseLaneWidth } from "@/constants";
import { getMinYFromNoteNum, getOffsetXFromTick } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { useAtom } from "jotai";
import { selectedNoteIdsAtom } from "@/store/note";

interface NoteBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  note: PianoRollNote;
}
function NoteBlock({ note }: NoteBlockProps) {
  const theme = useTheme();
  const { scaleX } = useScaleX();
  const [selectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const noteIsSelected = selectedNoteIds.has(note.id);

  const {
    pitchRange: { numOfKeys },
    rendering,
  } = useConfig();

  useEffect(() => console.log("Context rendering", rendering), [rendering]);

  return (
    <div
      aria-label="piano-roll-note"
      className={styles["note"]}
      data-note-id={note.id}
      style={
        {
          "--saturation": `${0.2 + (note.velocity / 127) * 0.8}`,
          "--top": `${getMinYFromNoteNum(numOfKeys, note.noteNumber)}px`,
          "--left": `${getOffsetXFromTick(scaleX, note.tick)}px`,
          "--note-width": `${getOffsetXFromTick(scaleX, note.duration)}px`,
          "--note-height": `${baseLaneWidth}px`,
          "--background": noteIsSelected ? theme.note.noteBackgroundColor : theme.note.noteBackgroundColor,
          "--border-color": noteIsSelected ? theme.note.noteBorderColor : theme.note.noteBorderColor,
          "--border-radius": `${theme.note.noteBorderRadius}px`,
          outline: noteIsSelected ? `3px solid #ffffff33` : "none",
        } as React.CSSProperties
      }
    />
  );
}

export default NoteBlock;
