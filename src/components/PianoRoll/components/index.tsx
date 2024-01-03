import LaneGrids from "./LaneGrids";
import { defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandlers from "../handlers/usePianoRollMouseHandlers";
import SelectionArea from "./SelectionArea";
import LanesBackground from "./LanesBackground";
import useStore from "../hooks/useStore";
import PianoKeyboard from "./PianoKeyboard";
import usePreventZoom from "../hooks/usePreventZoom";
import Ruler from "./Ruler";
import Notes from "./Notes";
import Playhead from "./Playhead";
import usePianoRollKeyboardHandlers from "../handlers/usePianoRollKeyboardHandlers";
import PositionMarker from "./PositionMarker";
import TempoInfo from "./TempoInfo";
import usePianoRollClipboardHandlers from "../handlers/usePianoRollClipboardHandlers";

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
  const clipboardHandlers = usePianoRollClipboardHandlers();
  const { pianoRollStore } = useStore()

  usePreventZoom();

  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>

      <div className={styles['container']}
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
            <Notes lyric={lyric} />

            <SelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
            <PositionMarker />
            <Playhead />
            <div style={{ position:'absolute', inset: '0', width: '100%', height: '100%' }} />
            <LanesBackground />
          </div>
        </div>
      </div>
    </PianoRollThemeContext.Provider>
  )

}
