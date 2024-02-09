import usePianoRollKeyboardHandlers from "@/handlers/usePianoRollKeyboardHandlers";
import usePianoRollMouseHandlers, { PianoRollLanesMouseHandlerMode } from "@/handlers/usePianoRollMouseHandlers";
import styles from "./index.module.scss";
import LaneGrids from "@/components/LaneGrids";
import Selections from "@/components/Selections";
import Notes from "@/components/Notes";
import SelectionArea from "@/components/SelectionMarquee";
import Playhead from "@/components/Playhead";
import LanesBackground from "@/components/LanesBackground";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { useEffect, useRef } from "react";

type Props = {
  attachLyric: boolean;
  playheadPosition: number | undefined;
};
const MiddleRightSection: React.FC<Props> = (props) => {
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
  const { scaleX } = useScaleX()

  function continuouslyDispatchPointerMove() {
    const timeout = setTimeout(() => {
      if (pianoRollMouseHandlersStates.mouseHandlerMode !== PianoRollLanesMouseHandlerMode.None) {
        console.log("timer out")
        containerRef.current!.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            clientX: pianoRollMouseHandlersStates.currentPointerPos.current.clientX,
            clientY: pianoRollMouseHandlersStates.currentPointerPos.current.clientY,
          }),
        );
      }
      continuouslyDispatchPointerMove();

    }, 1000/61);
    return timeout;
  }

  useEffect(() => {
    const timeout = continuouslyDispatchPointerMove();
    return () => {
      clearTimeout(timeout);
    };
  }, );

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles["pianoroll-lane"]} {...pianoRollMouseHandlers} tabIndex={0} {...pianoRollKeyboardHandlers} ref={containerRef}>
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
