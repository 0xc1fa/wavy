import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import { baseLaneWidth } from "@/constants";
import { useConfig } from "..";
import { canvasHeight } from "@/helpers/conversion";
import { isBlackKey } from "@/helpers";
import _ from "lodash";

function LanesBackground() {
  const theme = useTheme();
  const { startingNoteNum, numOfKeys } = useConfig().range;
  const noteNums = _.range(startingNoteNum, startingNoteNum + numOfKeys);

  const lanes = noteNums.map((noteNumber) => {
    const keyColor = isBlackKey(noteNumber) ? theme.lane.blackLaneColor : theme.lane.whiteLaneColor;
    const yPosition = canvasHeight(numOfKeys) - (noteNumber - 1) * baseLaneWidth;

    return <rect key={noteNumber} x={0} y={yPosition} width="100%" height={baseLaneWidth} fill={keyColor} />;
  });

  return (
    <svg aria-label="piano-roll-lanes-background" width="100%" height="100%" preserveAspectRatio="none">
      {lanes}
    </svg>
  );
}

export default memo(LanesBackground);
