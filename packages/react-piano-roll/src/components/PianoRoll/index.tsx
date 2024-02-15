import {useHandleNoteCreationAndModification} from "./handlers/useHandleNoteCreationAndModification";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Marker from "@/components/Marker";
import Notes from "@/components/Notes";
import SelectionMarquee from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { memo, useRef } from "react";
import { useClipboard } from "@/components/Notes/handlers/useClipboard";
import { useHandleSpaceDown } from "@/components/PianoRoll/handlers/useHandleSpaceDown";
import { useHandleUndoRedo } from "@/components/PianoRoll/handlers/useHandleUndoRedo";
import { useHandleScaleX } from "@/components/PianoRoll/handlers/useHandleScaleX";
import { useHandleMarqueeSelection } from "./handlers/useHandleMarqueeSelection";
import { useHandleRangeSelection } from "./handlers/useHandleRangeSelection";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  const {
    useHandleNoteCreationAndModificationPD,
    useHandleNoteCreationAndModificationPM,
    useHandleNoteCreationAndModificationPU,
  } = useHandleNoteCreationAndModification();
  const containerRef = useRef<HTMLDivElement>(null);

  useClipboard(containerRef);
  useHandleSpaceDown(containerRef);
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
      {props.playheadPosition !== undefined && <Playhead playheadPosition={props.playheadPosition} />}
      <LanesBackground />
    </div>
  );
});

export default PianoRoll;
