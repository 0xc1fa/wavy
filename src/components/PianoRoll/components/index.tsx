import PianoRollGrids from "./PianoRollGrids";
import { defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandlers from "../handlers/usePianoRollMouseHandlers";
import PianoRollSelectionArea from "./PianoRollSelectionArea";
import PianoRollLanesBackground from "./PianoRollLanesBackground";
import useStore from "../hooks/useStore";
import PianoRollKeys from "./PianoRollKeys";
import usePreventZoom from "../hooks/usePreventZoom";
import PianoRollRuler from "./PianoRollRuler";
import PianoRollNotes from "./PianoRollNotes";
import PianoRollPlayHead from "./PianoRollPlayHead";
import usePianoRollKeyboardHandlers from "../handlers/usePianoRollKeyboardHandlers";

interface PianoRollProps extends React.HTMLAttributes<HTMLDivElement> {
  notes: TrackNoteEvent[];
  playing?: boolean;
  lyric?: boolean;
};
export default function PianoRoll({
  notes,
  playing = false,
  lyric = false
}: PianoRollProps) {

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandlers();
  const pianoRollKeyboardHandlers = usePianoRollKeyboardHandlers();
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
        <div className={styles['ruler-container']}>
          <PianoRollRuler />
        </div>
        <div className={styles['lower-container']}>
          <PianoRollKeys />
          <div className={styles['pianoroll-lane']} {...pianoRollMouseHandlers}
          tabIndex={0}
          {...pianoRollKeyboardHandlers}>

            <PianoRollGrids />
            <PianoRollNotes lyric={lyric} />
            <div style={{ position:'absolute', inset: '0', width: '100%', height: '100%' }} />
            <PianoRollSelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
            <PianoRollPlayHead />
            <PianoRollLanesBackground />
          </div>
        </div>
      </div>
    </PianoRollThemeContext.Provider>
  )

}
