import LaneGrids from "./LaneGrids";
import { defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import usePianoRollMouseHandlers from "../handlers/usePianoRollMouseHandlers";
import SelectionArea from "./SelectionMarquee";
import LanesBackground from "./LanesBackground";
import useStore from "../hooks/useStore";
import PianoKeyboard from "./PianoKeyboard";
import usePreventZoom from "../hooks/usePreventZoom";
import Ruler from "./Ruler";
import Notes from "./Notes";
import Playhead from "./Playhead";
import usePianoRollKeyboardHandlers from "../handlers/usePianoRollKeyboardHandlers";
import TempoInfo from "./TempoInfo";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import Selections from "./Selections";
import { KeyboardEvent, useEffect, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import VelocityEditor from "./VelocityEditor";

interface PianoRollProps extends React.HTMLAttributes<HTMLDivElement> {
  playheadPosition?: number;
  attachLyric?: boolean;
  initialScrollMiddleNote?: number;
  onSpace?: (event: KeyboardEvent<HTMLDivElement>) => void,
  onNoteCreate?: (notes: TrackNoteEvent[]) => void,
  onNoteUpdate?: (notes: TrackNoteEvent[]) => void,
  onNoteSelect?: (notes: TrackNoteEvent[]) => void,
}
export default function PianoRoll({
  playheadPosition,
  attachLyric = false,
  initialScrollMiddleNote = 60,
  onSpace,
}: PianoRollProps) {

  if (initialScrollMiddleNote < 0 || initialScrollMiddleNote > 127) {
    initialScrollMiddleNote = 60;
  }

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
  const { pianoRollStore } = useStore()

  const containerRef = useRef<HTMLDivElement>(null);

  usePreventZoom();
  const dispatch = usePianoRollDispatch();

  useEffect(() => {
    if (!containerRef) {
      return
    }
    const containerHeight = containerRef.current?.offsetHeight
    const c4KeyElement = document.querySelector(`[data-keynum="${initialScrollMiddleNote}"]`) as HTMLDivElement;
    const c4KeyTop = c4KeyElement.getBoundingClientRect().top;

    // Thanks to strict mode rendering twice, we need to prevent the second scrolling which reset it to top
    if (c4KeyTop > 300) {
      containerRef.current?.scroll(0, c4KeyTop - containerHeight! / 2);
    }
  }, [])

  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
      <div className={styles['container']}
        ref={containerRef}
        style={{
          '--lane-length': `${pianoRollStore.laneLength}px`,
          '--canvas-height': `${pianoRollStore.canvasHeight}px`,
        } as React.CSSProperties }
        tabIndex={0}
      >
        <div className={styles['upper-container']}>
          <TempoInfo />
          <Ruler />
        </div>
        <div className={styles['lower-container']}>
          <PianoKeyboard />
          <div className={styles['lane-container']}>
            <div className={styles['pianoroll-lane']} {...pianoRollMouseHandlers}
              tabIndex={0}
              {...pianoRollKeyboardHandlers}
            >
              <LaneGrids />
              <Selections />
              <Notes attachLyric={attachLyric} />
              <SelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
              {playheadPosition !== undefined && <Playhead playheadPosition={playheadPosition}/>}
              <div style={{ position:'absolute', inset: '0', width: '100%', height: '100%' }} />
              <LanesBackground />

            </div>
            <VelocityEditor />
          </div>
        </div>
      </div>

    </PianoRollThemeContext.Provider>
  )

}
