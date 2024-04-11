import { useHandleNoteCreationAndModification } from "./handlers/useHandleNoteCreationAndModification";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Marker from "@/components/Marker";
import Notes from "@/components/Notes";
import SelectionMarquee from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { memo, useRef } from "react";
import { useUndoRedoHotkey } from "@/components/PianoRoll/handlers/useUndoRedoHotkey";
import { useHandleScaleX } from "@/components/PianoRoll/handlers/useHandleScaleX";
import { useMarqueeTouchHandler } from "./handlers/useMarqueeTouchHandler";
import { useHandleRangeSelection } from "./handlers/useHandleRangeSelection";

type Props = {
  attachLyric: boolean;
  currentTime: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useHandleNoteCreationAndModification(containerRef);
  useUndoRedoHotkey(containerRef);
  useHandleScaleX(containerRef);
  const { marqueeGeometry } = useMarqueeTouchHandler(containerRef);
  useHandleRangeSelection(containerRef);

  return (
    <div className={styles["pianoroll-lane"]} tabIndex={0} ref={containerRef}>
      <LaneGrids />
      <Marker />
      <Notes attachLyric={props.attachLyric} />
      <SelectionMarquee marqueePosition={marqueeGeometry} />
      {props.currentTime !== undefined && <Playhead currentTime={props.currentTime} />}
      <LanesBackground />
    </div>
  );
});

export default PianoRoll;
