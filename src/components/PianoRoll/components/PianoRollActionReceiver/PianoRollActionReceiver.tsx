import { CSSProperties, memo } from "react";
import styles from "./piano-roll-event-receiver.module.scss";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import usePianoRollMouseHandler from "../../hooks/usePianoRollMouseHandler";

interface PianoRollEventsReceiverProps extends React.HTMLAttributes<HTMLDivElement> {}
function PianoRollEventsReceiver({ style, ...other }: PianoRollEventsReceiverProps) {

  const { laneLength, canvasHeight } = usePianoRollTransform();

  const { pianoRollMouseHandlers, pianoRollMouseHandlersStates } = usePianoRollMouseHandler();

  return (
    <div aria-label="piano-roll-events-receiver"
      className={styles['receiver']}
      style={{
        '--lane-length': `${laneLength}px`,
        '--canvas-height': `${canvasHeight}px`,
        ...style
      } as CSSProperties}
      {...pianoRollMouseHandlers}
      {...other}
    />
  );
};

export default memo(PianoRollEventsReceiver);