import PianoRollGrids from "./PianoRollGrids";
import { PianoRollTheme, defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollNoteBlock from "./PianoRollNoteBlock";
import PianoRollNoteLyric from "./PianoRollNoteLyric";
import PianoRollPitchCurve from "./PianoRollPitchCurve";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandler from "../hooks/usePianoRollMouseHandler";
import PianoRollSelectionArea from "./PianoRollSelectionArea";
import PianoRollLanesBackground from "./PianoRollLanesBackground";
import useStore from "../hooks/useStore";
import { PianoRollStoreProvider } from "../store/pianoRollStore";
import PianoRollKeys from "./PianoRollKeys";
import usePreventZoom from "../hooks/usePreventZoom";
import PianoRollRuler from "./PianoRollRuler";

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
    // <PianoRollStoreProvider>
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
      {/* <div className={styles['container']}> */}

        <div className={styles['v-scroll']} style={{ overflow: 'auto' }}>
          <div style={{ position: "sticky", height: '30px', gridColumn: '2', zIndex: 999, display: 'flex', alignItems: 'stretch', top: 0 }}>
            <PianoRollRuler />
          </div>
          <div>
            <PianoRollKeys style={{ position: "sticky", gridRow: 2 }} />
            <div className={styles['h-scroll']} style={{ gridRow: 2, gridColumn: 2 }}>

              <div className={styles['pianoroll-lane']}
                style={{
                  '--lane-length': `${pianoRollStore.laneLength}px`,
                  '--canvas-height': `${pianoRollStore.canvasHeight}px`,
                } as React.CSSProperties}
                {...pianoRollMouseHandlers}
              >
                <PianoRollGrids />
                <div>
                {pianoRollStore.pianoRollNotes.map(note =>
                  <div className={styles['note']}>
                    <PianoRollNoteBlock note={note} />
                    {lyric && <PianoRollNoteLyric note={note} />}
                  </div>
                )}
                </div>
                <div style={{ width: '100%', height: '100%' }}></div>
                <PianoRollSelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
                <PianoRollLanesBackground />
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </PianoRollThemeContext.Provider>
    // </PianoRollStoreProvider>
  )

}
