import { basePixelsPerTick } from "@/constants";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useStore } from "@/index";

const triangleWidth = 7;
const indicatorHeight = 10;
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
    <svg width="100%" height={indicatorHeight} style={{ position: "absolute", bottom: -indicatorHeight, left: 0 }}>
      <polygon
        points={`
          ${startingX - triangleWidth},0
          ${startingX + triangleWidth},0
          ${startingX},${indicatorHeight}
        `}
        fill="#ffffff30"
      />
      <g style={{ fill: "#ffffff20" }}>
        <polygon points={`
            ${startingX + triangleWidth},0
            ${startingX + triangleWidth},${indicatorHeight}
            ${startingX},${indicatorHeight}
          `}
        />
        <rect x={startingX + triangleWidth} y="0" width={endingX - startingX - 2 * triangleWidth} height="100%" />
        <polygon points={`
            ${endingX - triangleWidth},0
            ${endingX - triangleWidth},${indicatorHeight}
            ${endingX},${indicatorHeight}
          `}
        />
      </g>
      <polygon
        points={`
          ${endingX - triangleWidth},0
          ${endingX + triangleWidth},0
          ${endingX},${indicatorHeight}
        `}
        fill="#ffffff30"
      />
    </svg>
  );
};

export default SelectionRangeIndicator;
