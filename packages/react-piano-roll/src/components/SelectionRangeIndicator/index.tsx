import { selectedNotesAtom } from "@/store/note";
import { selectionRangeAtom } from "@/store/selection-ticks";
import { basePixelsPerTick } from "@/constants";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useAtomValue } from "jotai";

const triangleWidth = 8;
const indicatorHeight = 8;
const triangleHeight = 8;
const SelectionRangeIndicator = () => {
  const selectionRange = useAtomValue(selectionRangeAtom);
  const selectedNotes = useAtomValue(selectedNotesAtom);
  const { scaleX } = useScaleX();

  if (selectionRange === null) {
    return;
  }
  let totalSelectionRange = getSelectionRangeWithSelectedNotes(selectedNotes, selectionRange);

  const startingX = Math.round(totalSelectionRange[0] * basePixelsPerTick * scaleX);
  const endingX = Math.round(totalSelectionRange[1] * basePixelsPerTick * scaleX);
  if (startingX === endingX) {
    return null;
  }

  return (
    <svg width="100%" height={triangleHeight} style={{ position: "absolute", bottom: -triangleHeight, left: 0 }}>
      <polygon
        points={`
          ${startingX - triangleWidth * 0.9},0
          ${startingX},0
          ${startingX},${triangleHeight}
        `}
        fill="#ffffff30"
      />
      <polygon
        points={`
            ${startingX},0
            ${endingX},0
            ${endingX},${indicatorHeight}
            ${startingX},${indicatorHeight}
          `}
        fill="#ffffff28"
      />
      <polygon
        points={`
          ${endingX},0
          ${endingX + triangleWidth * 0.9},0
          ${endingX},${triangleHeight}
        `}
        fill="#ffffff30"
      />
    </svg>
  );
};

export default SelectionRangeIndicator;
