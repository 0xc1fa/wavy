import PianoRollGrids from "./PianoRollGrids";
import { PianoRollTheme, defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollNotes from "./PianoRollNotes";
import PianoRollNotesLyrics from "./PianoRollNotesLyrics";
import PianoRollPitchCurve from "./PianoRollPitchCurve";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./piano-roll.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandler from "../hooks/usePianoRollMouseHandler";
import PianoRollSelectionArea from "./PianoRollSelectionArea";
import PianoRollLanesBackground from "./PianoRollLanesBackground";
import useStore from "../hooks/useStore";

interface PianoRollProps extends React.HTMLAttributes<HTMLDivElement> {
  notes?: TrackNoteEvent[];
  theme?: PianoRollTheme
};
export default function PianoRoll({ theme, notes, children, ...other }: PianoRollProps) {

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandler();
  const { pianoRollStore } = useStore()


  return (
    <PianoRollThemeContext.Provider value={theme ? theme : defaultPianoRollTheme()}>
      <div
        style={{
          '--lane-length': `${pianoRollStore.laneLength}px`,
          '--canvas-height': `${pianoRollStore.canvasHeight}px`,
        } as React.CSSProperties}
        className={styles['piano-roll-lane']} {...other} {...pianoRollMouseHandlers}
      >
        <PianoRollGrids />
        <div>
        {pianoRollStore.pianoRollNotes.map(note =>
          <div style={{ position: 'absolute' }}>
            <PianoRollNotes note={note} />
            <PianoRollNotesLyrics note={note} />
            <PianoRollPitchCurve note={note} />
          </div>
        )}
        </div>
        <PianoRollSelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} />
        {children}
        <PianoRollLanesBackground />
      </div>
    </PianoRollThemeContext.Provider>
  )

}
