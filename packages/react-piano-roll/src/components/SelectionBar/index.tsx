import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import styles from "./index.module.scss";
import { basePixelsPerBeat } from "@/constants";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

interface RulerProps extends React.HTMLAttributes<SVGElement> {
  scaleX: number;
}
export default function SelectionBar({ scaleX }: RulerProps) {
  const { tickRange, timeSignature } = useConfig();

  const numberOfGrids = getNumOfGrid(baseCanvasWidth(tickRange), scaleX);
  const gridSeparationFactor = getGridSeparationFactor(timeSignature![0], scaleX);
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);
  const rulerHeight = 30;
  const markeraHeight = {
    bar: rulerHeight - 21,
    halfBar: rulerHeight - 24,
    quarter: rulerHeight - 27,
  };

  const markers = (gridType: "bar" | "halfBar" | "quarter") => {
    const scale = scaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0)
      .map((index) => (
        <SelectionBarMarker key={index} x={index * basePixelsPerBeat * scale} height={markeraHeight[gridType]} />
      ));
  };

  return (
    <div className={styles["ruler-container"]}>
      <svg
        aria-label="pianoroll-ruler"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className={styles["ruler"]}
      >
        {markers("quarter")}
        {markers("bar")}
        {markers("halfBar")}
      </svg>
    </div>
  );
}

interface SelectionBarMarkerProps {
  x: number;
  height: number;
}
function SelectionBarMarker({ x, height }: SelectionBarMarkerProps) {
  return <line x1={x} y1={0} x2={x} y2={height} stroke="#232323" strokeWidth="1" />;
}
