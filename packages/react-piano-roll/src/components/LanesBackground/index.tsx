import { memo } from "react";
import _ from "lodash";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import Lane from "./Lane";

const LanesBackground: React.FC = memo(() => {
  const { startingNoteNum, numOfKeys } = useConfig().pitchRange;
  const noteNums = _.range(startingNoteNum + numOfKeys - 1, startingNoteNum - 1, -1);

  return (
    <svg aria-label="piano-roll-lanes-background" width="100%" height="100%" preserveAspectRatio="none">
      {noteNums.map((noteNumber) => (
        <Lane noteNumber={noteNumber} key={noteNumber} />
      ))}
    </svg>
  );
});

export default LanesBackground;
