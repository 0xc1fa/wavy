import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import styles from "./index.module.scss";
import { useStore } from "@/hooks/useStore";
import { memo } from "react";
import { baseLaneWidth } from "@/constants";
import { getMinYFromNoteNum, getOffsetXFromTick } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";

interface NoteLyricProps extends React.HTMLAttributes<HTMLInputElement> {
  note: TrackNoteEvent;
}
function NoteLyric({ note, style }: NoteLyricProps) {
  const { dispatch } = useStore();
  const { numOfKeys } = useConfig().pitchRange;
  const { scaleX } = useScaleX();

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
      dispatch({
        type: "UPDATE_NOTE_LYRIC",
        payload: { noteId: id, lyric: target.value },
      });
    };
    trimValue();
    applyChanges();
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({
      type: "UPDATE_NOTE_LYRIC",
      payload: { noteId: note.id, lyric: event.target.value },
    });
  };

  return (
    <input
      type="text"
      data-noteid={note.id}
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
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      onChange={onChange}
    />
  );
}

export default NoteLyric;
