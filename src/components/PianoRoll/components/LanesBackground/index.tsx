import React, { memo } from 'react';
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import useTheme from "../../hooks/useTheme";
import useStore from "../../hooks/useStore";

interface LanesBackgroundProps extends React.HTMLAttributes<SVGElement> {}
function LanesBackground({ ...other }: LanesBackgroundProps) {
  const transform = usePianoRollTransform();
  const theme = useTheme();
  const { pianoRollStore } = useStore();

  const isBlackKey = (noteNumber: number) => {
    const pattern = [false, true, false, true, false, false, true, false, true, false, true, false];
    return pattern[noteNumber % 12];
  };

  function range(start: number, stop?: number, step?: number) {
    if (typeof stop == 'undefined') {
      stop = start;
      start = 0;
    }

    if (typeof step == 'undefined') {
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
  };


  const noteNums = range(
    pianoRollStore.startingNoteNum,
    pianoRollStore.startingNoteNum + pianoRollStore.numOfKeys
  );

  const lanes = noteNums.map(noteNumber => {
    const keyColor = isBlackKey(noteNumber) ? theme.lane.blackLaneColor : theme.lane.whiteLaneColor;
    const yPosition = transform.canvasHeight - (noteNumber * transform.laneWidth) - transform.laneWidth;

    return (
      <rect
        key={noteNumber}
        x={0}
        y={yPosition}
        width={transform.pianoLaneScaleX * pianoRollStore.laneLength}
        height={transform.laneWidth}
        fill={keyColor}
      />
    );
  });

  return (
    <svg
      aria-label="piano-roll-lanes-background"
      width={transform.pianoLaneScaleX * pianoRollStore.laneLength}
      height={transform.canvasHeight}
      {...other}
    >
      {lanes}
    </svg>
  );
}

export default memo(LanesBackground);
