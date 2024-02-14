import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import { baseLaneWidth } from "@/constants";
import { baseCanvasHeight } from "@/helpers/conversion";
import { isBlackKey } from "@/helpers";
import _ from "lodash";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import styles from "./index.module.scss";

const LanesBackground: React.FC = memo(() => {
  const theme = useTheme();
  const { startingNoteNum, numOfKeys } = useConfig().pitchRange;
  const noteNums = _.range(startingNoteNum + numOfKeys - 1, startingNoteNum - 1, -1);

  const lanes = noteNums.map((noteNumber) => {
    const keyColor = isBlackKey(noteNumber) ? theme.lane.blackLaneColor : theme.lane.whiteLaneColor;
    const yPosition = baseCanvasHeight(numOfKeys) - (noteNumber + 1) * baseLaneWidth;

    return (
      <rect
        data-note-num={noteNumber}
        className={[styles.lane, isBlackKey(noteNumber) ? styles.blackLane : styles.whiteLane].join(" ")}
        key={noteNumber}
        // x={0}
        y={yPosition}
      />
    );
  });

  return (
    <svg aria-label="piano-roll-lanes-background" width="100%" height="100%" preserveAspectRatio="none">
      {lanes}
    </svg>
  );
});

export default LanesBackground;
