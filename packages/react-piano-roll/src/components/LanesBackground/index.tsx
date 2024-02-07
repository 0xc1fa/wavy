import React, { memo } from "react";
import useTheme from "../../hooks/useTheme";
import useStore from "../../hooks/useStore";
import { baseLaneWidth } from "@/constants";




interface LanesBackgroundProps extends React.HTMLAttributes<SVGElement> {}
function LanesBackground({ ...other }: LanesBackgroundProps) {
  const theme = useTheme();
  const { pianoRollStore } = useStore();

  const isBlackKey = (noteNumber: number) => {
    const pattern = [false, true, false, true, false, false, true, false, true, false, true, false];
    return pattern[noteNumber % 12];
  };

  function range(start: number, stop?: number, step?: number) {
    if (typeof stop == "undefined") {
      stop = start;
      start = 0;
    }

    if (typeof step == "undefined") {
      step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
    }

    return result;
  }

  const noteNums = range(pianoRollStore.startingNoteNum, pianoRollStore.startingNoteNum + pianoRollStore.numOfKeys);

  const lanes = noteNums.map((noteNumber) => {
    const keyColor = isBlackKey(noteNumber) ? theme.lane.blackLaneColor : theme.lane.whiteLaneColor;
    const yPosition = pianoRollStore.canvasHeight - (noteNumber - 1) * baseLaneWidth;

    return <rect key={noteNumber} x={0} y={yPosition} width="100%" height={baseLaneWidth} fill={keyColor} />;
  });

  return (
    <svg aria-label="piano-roll-lanes-background" width="100%" height="100%" preserveAspectRatio="none" {...other}>
      {lanes}
    </svg>
  );
}

export default memo(LanesBackground);
