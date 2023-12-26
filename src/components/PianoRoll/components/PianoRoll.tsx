import PianoRollGrids from "./PianoRollGrids/PianoRollGrids";
import { PianoRollTheme, defaultPianoRollTheme } from "@/components/PianoRoll/store/pianoRollTheme";
import PianoRollNotes from "./PianoRollNotes/PianoRollNotes";
import PianoRollNotesLyrics from "./PianoRollNotesLyrics/PianoRollNotesLyrics";
import PianoRollPitchCurve from "./PianoRollPitchCurve/PianoRollPitchCurve";
import PianoRollThemeContext  from "../contexts/piano-roll-theme-context";
import styles from "./piano-roll.module.scss";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import usePianoRollMouseHandler from "../hooks/usePianoRollMouseHandler";
import PianoRollSelectionArea from "./PianoRollSelectionArea/PianoRollSelectionArea";
import PianoRollEventsReceiver from "./PianoRollActionReceiver/PianoRollActionReceiver";
import PianoRollLanesBackground from "./PianoRollLanesBackground/DivPianoRollLanesBackground";

interface PianoRollProps extends React.HTMLAttributes<HTMLDivElement> {
  note?: TrackNoteEvent[];
  theme?: PianoRollTheme
};
export default function PianoRoll({ theme, note, children, ...other }: PianoRollProps) {

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandler();

  return (
    <PianoRollThemeContext.Provider value={theme ? theme : defaultPianoRollTheme()}>
      <div className={styles['piano-roll-lane']} {...other} {...pianoRollMouseHandlers}>
        {/* <PianoRollEventsReceiver style={{ zIndex: 21 }} /> */}
        {/* {children} */}
        <PianoRollSelectionArea mouseHandlersStates={pianoRollMouseHandlersStates} style={{ zIndex: 21 }} />
        <PianoRollNotesLyrics style={{ zIndex: 20 }} />
        <PianoRollPitchCurve style={{ zIndex: 19 }} />
        <PianoRollNotes style={{ zIndex: 18 }} />
        <PianoRollGrids style={{ zIndex: 17 }} />
        <PianoRollLanesBackground />
      </div>
    </PianoRollThemeContext.Provider>
  )

}
