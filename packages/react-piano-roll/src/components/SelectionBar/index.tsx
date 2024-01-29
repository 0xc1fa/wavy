import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from "./index.module.scss";

interface RulerProps extends React.HTMLAttributes<SVGElement> {}
export default function SelectionBar({ ...other }: RulerProps) {
  const { laneLength, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const numberOfGrids = getNumOfGrid(pixelPerBeat, laneLength);
  const gridSeparationFactor = getGridSeparationFactor(pixelPerBeat, pianoLaneScaleX);
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);
  const rulerHeight = 30;
  const markeraHeight = {
    bar: rulerHeight - 21,
    halfBar: rulerHeight - 24,
    quarter: rulerHeight - 27,
  };

  const markers = (gridType: "bar" | "halfBar" | "quarter") => {
    const scale = pianoLaneScaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0)
      .map((index) => (
        <SelectionBarMarker key={index} x={index * pixelPerBeat * scale} height={markeraHeight[gridType]} />
      ));
  };

  return (
    <div onClick={(event) => console.log(event.nativeEvent.offsetX)} className={styles["ruler-container"]}>
      <svg
        aria-label="pianoroll-ruler"
        width="100%"
        height="100%"
        {...other}
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
