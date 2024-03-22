import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import styles from "./index.module.scss";
// import { useStore } from "@/hooks/useStore";
import { memo, useRef } from "react";
import { baseLaneWidth } from "@/constants";
import { getMinYFromNoteNum, getOffsetXFromTick } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { useAtom } from "jotai";
import { updateNoteLyricAtom } from "@/store/note";

const handleDoubleClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
  event?.currentTarget.focus();
};

interface NoteLyricProps extends React.HTMLAttributes<HTMLInputElement> {
  note: TrackNoteEvent;
}
function NoteLyric({ note, style }: NoteLyricProps) {
  // const { dispatch } = useStore();
  const [, updateNoteLyric] = useAtom(updateNoteLyricAtom);
  const { numOfKeys } = useConfig().pitchRange;
  const { scaleX } = useScaleX();

  const ref = useRef<HTMLInputElement>(null);

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") (event.target as HTMLInputElement).blur();
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const target = event.currentTarget as HTMLInputElement;
    const trimValue = () => {
      target.value = target.value.trim();
    };
    const getTargetId = () => {
      return target.dataset.index!;
    };
    const applyChanges = () => {
      const id = getTargetId();
      updateNoteLyric({ noteId: id, lyric: target.value });
    };
    trimValue();
    applyChanges();
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    updateNoteLyric({ noteId: note.id, lyric: event.target.value });
  };

  return (
    <input
      ref={ref}
      type="text"
      data-note-id={note.id}
      className={styles["lyric"]}
      placeholder=" - "
      style={
        {
          "--top": `${getMinYFromNoteNum(numOfKeys, note.noteNumber)}px`,
          "--left": `${getOffsetXFromTick(scaleX, note.tick)}px`,
          "--width": `${getOffsetXFromTick(scaleX, note.duration)}px`,
          "--height": `${baseLaneWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      value={note.lyric}
      // the prevent default also prevent the input from blur when clicking on another note
      onPointerDown={(event) => event.preventDefault()}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      onChange={onChange}
    />
  );
}

export default NoteLyric;
