import LaneGrids from "./LaneGrids";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import PianoRollThemeContext from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import usePianoRollMouseHandlers from "../handlers/usePianoRollMouseHandlers";
import SelectionArea from "./SelectionMarquee";
import LanesBackground from "./LanesBackground";
import useStore from "../hooks/useStore";
import PianoKeyboard from "./PianoKeyboard";
import Ruler from "./Ruler";
import Notes from "./Notes";
import Playhead from "./Playhead";
import usePianoRollKeyboardHandlers from "../handlers/usePianoRollKeyboardHandlers";
import TempoInfo from "./TempoInfo";
import Selections from "./Selections";
import { CSSProperties, KeyboardEvent, useLayoutEffect, useMemo, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import VelocityEditor from "./VelocityEditor";
import SelectionBar from "./SelectionBar";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider, PianoRollConfig } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/hooks/useScrollToNote";

interface PianoRollProps {
  playheadPosition?: number;
  attachLyric?: boolean;
  initialScrollMiddleNote?: number;
  onSpace?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onNoteCreate?: (notes: TrackNoteEvent[]) => void;
  onNoteUpdate?: (notes: TrackNoteEvent[]) => void;
  onNoteSelect?: (notes: TrackNoteEvent[]) => void;
  tickRange?: [number, number];
  style?: CSSProperties;
  pitchRange?: PitchRange;
}
function PianoRoll({
  playheadPosition,
  attachLyric = false,
  initialScrollMiddleNote = 60,
  onSpace,
  style,
  tickRange = [0, 480 * 4 * 8],
  pitchRange = { startingNoteNum: 0, numOfKeys: 128 },
}: PianoRollProps) {
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
  const { pianoRollStore } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  useScrollToNote(containerRef, initialScrollMiddleNote);

  const config = useMemo(() => {
    const config: PianoRollConfig = {
      pitchRange: pitchRange,
      tickRange: tickRange,
    };
    return config;
  }, []);

  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
      <ConfigProvider value={config}>
        <div
          className={`${styles["container"]} piano-roll`}
          ref={containerRef}
          style={
            {
              "--canvas-width": `${baseCanvasWidth(tickRange) * pianoRollStore.pianoLaneScaleX}px`,
              "--canvas-height": `${baseCanvasHeight(pitchRange.numOfKeys)}px`,
              ...style,
            } as React.CSSProperties
          }
          tabIndex={0}
        >
          <div className={styles["upper-container"]} onClick={(event) => console.log(event.clientX)}>
            <TempoInfo />
            <div>
              <Ruler />
              <SelectionBar />
            </div>
          </div>
          <div className={styles["middle-container"]}>
            <PianoKeyboard />
            <div className={styles["lane-container"]}>
              <div
                className={styles["pianoroll-lane"]}
                {...pianoRollMouseHandlers}
                tabIndex={0}
                {...pianoRollKeyboardHandlers}
              >
                <LaneGrids />
                <Selections />
                <Notes attachLyric={attachLyric} />
                <SelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
                {playheadPosition !== undefined && <Playhead playheadPosition={playheadPosition} />}
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
            </div>
          </div>
          <div className={styles["lower-container"]}>
            <VelocityEditor />
          </div>
        </div>
      </ConfigProvider>
    </PianoRollThemeContext.Provider>
  );
}

export default PianoRoll;
