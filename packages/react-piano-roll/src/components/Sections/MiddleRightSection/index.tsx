import usePianoRollMouseHandlers from "@/handlers/usePianoRollMouseHandlers";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Selections from "@/components/Selections";
import Notes from "@/components/Notes";
import SelectionArea from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { useRef } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { useHandleDelete } from "@/hooks/useHandleDelete";
import { useHandleSpaceDown } from "@/hooks/useHandleSpaceDown";
import { useHandleUndoRedo } from "@/hooks/useHandleUndoRedo";
import { usePresistentPointerMove } from "@/hooks/usePersistentPointerMove";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const MiddleRightSection: React.FC<Props> = (props) => {
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const containerRef = useRef<HTMLDivElement>(null);

  usePresistentPointerMove(containerRef)
  useClipboard(containerRef);
  useHandleDelete(containerRef);
  useHandleSpaceDown(containerRef);
  useHandleUndoRedo(containerRef);

  return (
    <div className={styles["pianoroll-lane"]} {...pianoRollMouseHandlers} tabIndex={0} ref={containerRef}>
      <LaneGrids />
      <Selections />
      <Notes attachLyric={props.attachLyric} />
      <SelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
      {props.playheadPosition !== undefined && <Playhead playheadPosition={props.playheadPosition} />}
      <div
        style={{
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
        }}
      />
      <LanesBackground />
    </div>
  );
};

export default MiddleRightSection;
