import { useHandleNoteCreationAndModification } from "./handlers/useHandleNoteCreationAndModification";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Marker from "@/components/Marker";
import Notes from "@/components/Notes";
import SelectionMarquee from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { memo, useImperativeHandle, useRef } from "react";
import { useClipboardKeyboardShortcut } from "@/components/Notes/handlers/useClipboardKeyboardShortcut";
import { useHandleUndoRedo } from "@/components/PianoRoll/handlers/useHandleUndoRedo";
import { useHandleScaleX } from "@/components/PianoRoll/handlers/useHandleScaleX";
import { useHandleMarqueeSelection } from "./handlers/useHandleMarqueeSelection";
import { useHandleRangeSelection } from "./handlers/useHandleRangeSelection";
import ModeSelect from "../ActionButtons";

type Props = {
  attachLyric: boolean;
  currentTime: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  const {
    useHandleNoteCreationAndModificationPD,
    useHandleNoteCreationAndModificationPM,
    useHandleNoteCreationAndModificationPU,
  } = useHandleNoteCreationAndModification();
  const containerRef = useRef<HTMLDivElement>(null);

  useClipboardKeyboardShortcut(containerRef);
  // useHandleSpaceDown(containerRef);
  useHandleUndoRedo(containerRef);
  useHandleScaleX(containerRef);
  const { marqueePosition, handleMarqueeSelectionPD, handleMarqueeSelectionPM, handleMarqueeSelectionPU } =
    useHandleMarqueeSelection();
  const { handleRangeSelectionPD, handleRangeSelectionPM } = useHandleRangeSelection();
  const handlers = {
    onPointerDown(event: React.PointerEvent) {
      handleMarqueeSelectionPD(event);
      handleRangeSelectionPD(event);
      useHandleNoteCreationAndModificationPD(event);
    },
    onPointerMove(event: React.PointerEvent) {
      handleMarqueeSelectionPM(event);
      handleRangeSelectionPM(event);
      useHandleNoteCreationAndModificationPM(event);
    },
    onPointerUp(event: React.PointerEvent) {
      handleMarqueeSelectionPU(event);
      useHandleNoteCreationAndModificationPU(event);
    },
  };

  return (
    <div className={styles["pianoroll-lane"]} {...handlers} tabIndex={0} ref={containerRef}>
      <LaneGrids />
      <Marker />
      <Notes attachLyric={props.attachLyric} />
      <SelectionMarquee marqueePosition={marqueePosition} />
      {props.currentTime !== undefined && <Playhead currentTime={props.currentTime} />}
      <LanesBackground />
    </div>
  );
});

export default PianoRoll;
