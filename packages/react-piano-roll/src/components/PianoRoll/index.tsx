import usePianoRollMouseHandlers from "@/handlers/usePianoRollMouseHandlers";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Marker from "@/components/Marker";
import Notes from "@/components/Notes";
import SelectionMarquee from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { memo, useRef } from "react";
import { useClipboard } from "@/components/PianoRoll/handlers/useClipboard";
import { useHandleSpaceDown } from "@/components/PianoRoll/handlers/useHandleSpaceDown";
import { useHandleUndoRedo } from "@/components/PianoRoll/handlers/useHandleUndoRedo";
import { usePresistentPointerMove } from "@/hooks/usePresistentPointerMove";
import { useHandleScaleX } from "@/components/PianoRoll/handlers/useHandleScaleX";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  console.log("PianoRoll");
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const containerRef = useRef<HTMLDivElement>(null);

  // usePresistentPointerMove(containerRef)
  useClipboard(containerRef);
  useHandleSpaceDown(containerRef);
  useHandleUndoRedo(containerRef);
  useHandleScaleX(containerRef);


  return (
    <div className={styles["pianoroll-lane"]} {...pianoRollMouseHandlers} tabIndex={0} ref={containerRef}>
      <LaneGrids />
      <Marker />
      <Notes attachLyric={props.attachLyric} />
      <SelectionMarquee mouseHandlersStates={pianoRollMouseHandlersStates} />
      {props.playheadPosition !== undefined && <Playhead playheadPosition={props.playheadPosition} />}
      <LanesBackground />
    </div>
  );
});

export default PianoRoll;
