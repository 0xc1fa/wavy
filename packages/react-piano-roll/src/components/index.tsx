"use client";
import LaneGrids from "./LaneGrids";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import PianoRollThemeContext from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import usePianoRollMouseHandlers from "../handlers/usePianoRollMouseHandlers";
import SelectionArea from "./SelectionMarquee";
import LanesBackground from "./LanesBackground";
import useStore from "../hooks/useStore";
import PianoKeyboard from "./PianoKeyboard";
import usePreventZoom, { disableZoom, enableZoom } from "../hooks/usePreventZoom";
import Ruler from "./Ruler";
import Notes from "./Notes";
import Playhead from "./Playhead";
import usePianoRollKeyboardHandlers from "../handlers/usePianoRollKeyboardHandlers";
import TempoInfo from "./TempoInfo";
import Selections from "./Selections";
import { CSSProperties, KeyboardEvent, createContext, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import VelocityEditor from "./VelocityEditor";
import SelectionBar from "./SelectionBar"
import type { PianoRollRange } from '@/interfaces/piano-roll-range'
import { canvasHeight } from "@/helpers/conversion";

type PianoRollConfig = {
  range: PianoRollRange;
}

const defaultPianoRollConfig: PianoRollConfig = {
  range: {
    startingNoteNum: 0,
    numOfKeys: 128,
  }
}


const PianoRollConfigContext = createContext(defaultPianoRollConfig)
const ConfigProvider = memo(PianoRollConfigContext.Provider)
export function useConfig() {
  return useContext(PianoRollConfigContext)
}

interface PianoRollProps {
  playheadPosition?: number;
  attachLyric?: boolean;
  initialScrollMiddleNote?: number;
  onSpace?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onNoteCreate?: (notes: TrackNoteEvent[]) => void;
  onNoteUpdate?: (notes: TrackNoteEvent[]) => void;
  onNoteSelect?: (notes: TrackNoteEvent[]) => void;
  staringTick?: number;
  endingTick?: number;
  style?: CSSProperties;
  range?: PianoRollRange;
}
function PianoRoll({
  playheadPosition,
  attachLyric = false,
  initialScrollMiddleNote = 60,
  onSpace,
  style,
  staringTick = 200,
  endingTick = 480 * 4 * 8,
  range = { startingNoteNum: 0, numOfKeys: 128 },
}: PianoRollProps) {
  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
  const { pianoRollStore } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  useScrollToNote(containerRef, initialScrollMiddleNote);

  const config = useMemo(() => {
    const config: PianoRollConfig = {
      range: range,
    }
    return config;
  }, [])

  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
    <ConfigProvider value={config}>
      <div
        className={`${styles["container"]} piano-roll`}
        ref={containerRef}
        style={
          {
            "--canvas-width": `${pianoRollStore.laneLength * pianoRollStore.pianoLaneScaleX}px`,
            "--canvas-height": `${canvasHeight(range.numOfKeys)}px`,
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

function useScrollToNote(containerRef: React.RefObject<HTMLElement>, initialScrollMiddleNote: number) {
  // const [scrolled, setScrolled] = useState(false);
  const scrolled = useRef(false);
  useLayoutEffect(() => {
    if (scrolled.current) {
      return;
    }
    const keyElement = document.querySelector(`[data-keynum="${initialScrollMiddleNote}"]`) as HTMLDivElement;
    const keyTop = keyElement.getBoundingClientRect().top;
    containerRef.current?.scrollBy(0, keyTop);
    scrolled.current = true;
  }, []);
}

export default PianoRoll;
