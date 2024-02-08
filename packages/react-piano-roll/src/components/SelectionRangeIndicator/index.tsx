import { basePixelsPerTick } from "@/constants";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useStore } from "@/hooks/useStore";

const triangleWidth = 8;
const indicatorHeight = 8;
const triangleHeight = 8;
const SelectionRangeIndicator = () => {
  const { pianoRollStore } = useStore();
  const { scaleX } = useScaleX();

  if (pianoRollStore.selectionRange === null) {
    return;
  }
  let selectionRange = getSelectionRangeWithSelectedNotes(
    pianoRollStore.selectedNotes(),
    pianoRollStore.selectionRange,
  );

  const startingX = Math.round(selectionRange[0] * basePixelsPerTick * scaleX);
  const endingX = Math.round(selectionRange[1] * basePixelsPerTick * scaleX);
  if (startingX === endingX) {
    return null;
  }

  return (
    <svg width="100%" height={triangleHeight} style={{ position: "absolute", bottom: -triangleHeight, left: 0 }}>
      <polygon
        points={`
          ${startingX - (triangleWidth * 0.9)},0
          ${startingX + triangleWidth},0
          ${startingX},${triangleHeight}
        `}
        fill="#ffffff30"
      />
      <polygon
        points={`
            ${startingX + triangleWidth},0
            ${endingX - triangleWidth},0
            ${endingX - (1 - indicatorHeight / triangleHeight) * triangleWidth},${indicatorHeight}
            ${startingX + (1 - indicatorHeight / triangleHeight) * triangleWidth},${indicatorHeight}
          `}
        fill="#ffffff23"
      />
      <polygon
        points={`
          ${endingX - triangleWidth},0
          ${endingX + (triangleWidth * 0.9)},0
          ${endingX},${triangleHeight}
        `}
        fill="#ffffff30"
      />
    </svg>
  );
};

export default SelectionRangeIndicator;
