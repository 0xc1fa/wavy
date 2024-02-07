import usePianoRollKeyboardHandlers from "@/handlers/usePianoRollKeyboardHandlers";
import usePianoRollMouseHandlers from "@/handlers/usePianoRollMouseHandlers";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Selections from "@/components/Selections";
import Notes from "@/components/Notes";
import SelectionArea from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const MiddleRightSection: React.FC<Props> = (props) => {
  // const { pianoLaneScaleX}
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
  return (
    <div className={styles["pianoroll-lane"]} {...pianoRollMouseHandlers} tabIndex={0} {...pianoRollKeyboardHandlers}>
      <LaneGrids scaleX={1}/>
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