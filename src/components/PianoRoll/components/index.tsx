import LaneGrids from "./LaneGrids";
import { defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
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
import usePianoRollClipboardHandlers from "../handlers/usePianoRollClipboardHandlers";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import Selections from "./Selections";
import { useEffect, useRef } from "react";

interface PianoRollProps extends React.HTMLAttributes<HTMLDivElement> {
  notes: TrackNoteEvent[];
  playing?: boolean;
  lyric?: boolean;
}
export default function PianoRoll({
  notes,
  playing = false,
  lyric = false
}: PianoRollProps) {

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
    const c4KeyElement = document.querySelector('[data-keynum="60"]') as HTMLDivElement;
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
          <div className={styles['pianoroll-lane']} {...pianoRollMouseHandlers}
            tabIndex={0}
            {...pianoRollKeyboardHandlers}
          >
            <LaneGrids />
            <Selections />
            <Notes lyric={lyric} />
            <SelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
            <Playhead />
            <div style={{ position:'absolute', inset: '0', width: '100%', height: '100%' }} />
            <LanesBackground />
          </div>
        </div>
      </div>
    </PianoRollThemeContext.Provider>
  )

}
