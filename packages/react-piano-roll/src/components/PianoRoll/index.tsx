import { useNoteCreationAndModificationGesture } from "./handlers/useNoteCreationAndModificationGesture";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Marker from "@/components/Marker";
import Notes from "@/components/Notes";
import SelectionMarquee from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { memo, useRef } from "react";
import { useUndoRedoHotkey } from "@/components/PianoRoll/handlers/useUndoRedoHotkey";
import { useZoomGesture } from "@/components/PianoRoll/handlers/useZoomGesture";
import { useMarqueeGesture } from "./handlers/useMarqueeGesture";
import { useRangeSelectionGesture } from "./handlers/useRangeSelectionGesture";
import { useNoteCreationGesture } from "./handlers/useNoteCreationGesture";
import { useCursorStyleUpdater } from "./handlers/useCursorStyleUpdater";

type Props = {
  attachLyric: boolean;
  currentTime: number | undefined;
};
const PianoRoll: React.FC<Props> = memo((props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useCursorStyleUpdater(containerRef);
  useNoteCreationGesture(containerRef);
  useNoteCreationAndModificationGesture(containerRef);
  useUndoRedoHotkey(containerRef);
  useZoomGesture(containerRef);
  const { marqueeGeometry } = useMarqueeGesture(containerRef);
  useRangeSelectionGesture(containerRef);

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
