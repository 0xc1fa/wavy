import usePianoRollMouseHandlers from "@/handlers/usePianoRollMouseHandlers";
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
import { usePresistentPointerMove } from "@/hooks/usePresistentPointerMove";
import { useHandleScaleX } from "@/components/PianoRoll/handlers/useHandleScaleX";
import { useHandleMarqueeSelection } from "./handlers/useHandleMarqueeSelection";
import { useHandleRangeSelection } from "./handlers/useHandleRangeSelection";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const containerRef = useRef<HTMLDivElement>(null);

  // usePresistentPointerMove(containerRef)
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
      pianoRollMouseHandlers.onPointerDown(event);
    },
    onPointerMove(event: React.PointerEvent) {
      handleMarqueeSelectionPM(event);
      handleRangeSelectionPM(event);
      pianoRollMouseHandlers.onPointerMove(event);
    },
    onPointerUp(event: React.PointerEvent) {
      handleMarqueeSelectionPU(event);
      pianoRollMouseHandlers.onPointerUp(event);
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
