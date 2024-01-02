import PianoRollGrids from "./PianoRollGrids";
import { defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandler from "../hooks/usePianoRollMouseHandler";
import PianoRollSelectionArea from "./PianoRollSelectionArea";
import PianoRollLanesBackground from "./PianoRollLanesBackground";
import useStore from "../hooks/useStore";
import PianoRollKeys from "./PianoRollKeys";
import usePreventZoom from "../hooks/usePreventZoom";
import PianoRollRuler from "./PianoRollRuler";
import PianoRollNotes from "./PianoRollNotes";

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

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandler();
  const { pianoRollStore } = useStore()

  usePreventZoom();


  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
      <div className={styles['container']}
        style={{
          '--lane-length': `${pianoRollStore.laneLength}px`,
          '--canvas-height': `${pianoRollStore.canvasHeight}px`,
        } as React.CSSProperties }
      >
        <div className={styles['ruler-container']}>
          <PianoRollRuler />
        </div>
        <div className={styles['lower-container']}>
          <PianoRollKeys />
          <div className={styles['h-scroll']}>
            <div className={styles['pianoroll-lane']}{...pianoRollMouseHandlers}>
              <PianoRollGrids />
              <PianoRollNotes lyric={lyric} />
              <div style={{ width: '100%', height: '100%' }}>P</div>
              <PianoRollSelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
              <PianoRollLanesBackground />
            </div>
          </div>
        </div>
      </div>
    </PianoRollThemeContext.Provider>
  )

}
