import { Fragment, memo } from "react";
import styles from "./index.module.scss";
import { getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import { basePixelsPerBeat } from "@/constants";
import useStore from "@/hooks/useStore";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

interface RulerProps extends React.HTMLAttributes<SVGElement> {}

const Ruler: React.FC<RulerProps> = ({ ...other }) => {
  const { pianoRollStore } = useStore();
  const { tickRange } = useConfig();

  const numberOfMarkers = getNumOfGrid(baseCanvasWidth(tickRange));
  const gridSeparationFactor = getGridSeparationFactor(pianoRollStore.pianoLaneScaleX);

  const barMarkers = [...Array(numberOfMarkers.bar).keys()]
    .filter((index) => index % gridSeparationFactor.bar === 0)
    .map((index) => (
      <RulerMarker key={index} x={index * basePixelsPerBeat * pianoRollStore.pianoLaneScaleX * 4}>
        {index + 1}
      </RulerMarker>
    ));

  return (
    <div className={styles["ruler-container"]}>
      <svg aria-label="pianoroll-ruler" width="100%" height="100%" {...other} className={styles["ruler"]}>
        {barMarkers}
      </svg>
    </div>
  );
};

interface RulerMarkerProps {
  x: number;
  children: React.ReactNode;
}
function RulerMarker({ x, children }: RulerMarkerProps) {
  const rulerHeight = 30;

  return (
    <g>
      <line x1={x} y1={5} x2={x} y2={rulerHeight} stroke="#232323" strokeWidth="1" />
      <text
        x={x + 5} // Adjust text position as needed
        y={13} // Adjust text position as needed
        className={styles["text"]}
        fill="#232323" // Text color
        fontSize="13" // Adjust font size as needed
      >
        {children}
      </text>
    </g>
  );
}

export default memo(Ruler);
