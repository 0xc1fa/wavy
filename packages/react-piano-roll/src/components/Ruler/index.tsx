import { Fragment, memo } from "react";
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from "./index.module.scss";
import { getNumOfGrid } from "@/helpers/grid";

interface RulerProps extends React.HTMLAttributes<SVGElement> {}

const Ruler: React.FC<RulerProps> = ({ ...other }) => {
  const { laneLength, pixelPerBeat, pianoLaneScaleX } =
    usePianoRollTransform();

  const numberOfMarkers = getNumOfGrid(pixelPerBeat, laneLength)

  const rulerHeight = 30;

  const barMarkers = Array.from(
    { length: numberOfMarkers.bar },
    (_, index) => (
      <g key={index}>
        <line
          key={index}
          x1={index * pixelPerBeat * pianoLaneScaleX * 4}
          y1={5}
          x2={index * pixelPerBeat * pianoLaneScaleX * 4}
          y2={rulerHeight}
          stroke="#232323"
          strokeWidth="1"
        />
        <text
          x={index * pixelPerBeat * pianoLaneScaleX * 4 + 5} // Adjust text position as needed
          y={13} // Adjust text position as needed
          className={styles["text"]}
          fill="#232323" // Text color
          fontSize="13" // Adjust font size as needed
        >
          {index + 1}
        </text>
      </g>
    ),
  );

  return (
    <div
      onClick={(event) => console.log(event.nativeEvent.offsetX)}
      className={styles["ruler-container"]}
    >
      <svg
        aria-label="pianoroll-ruler"
        width="100%"
        height="100%"
        {...other}
        className={styles["ruler"]}
      >
        {barMarkers}
      </svg>
    </div>
  );
};

export default memo(Ruler);
