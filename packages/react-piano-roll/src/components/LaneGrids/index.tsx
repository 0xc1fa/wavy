import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from "./index.module.scss";
import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";

interface LaneGridsProps extends React.HTMLAttributes<SVGElement> {}
const LaneGrids: React.FC<LaneGridsProps> = ({ ...other }) => {
  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const gridSeparationFactor = getGridSeparationFactor(pixelPerBeat, pianoLaneScaleX);
  const numberOfGrids = getNumOfGrid(pixelPerBeat, laneLength);
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);

  const gridLines = (gridType: "bar" | "quarter" | "quavers") => {
    const scale = pianoLaneScaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0 || gridType === "quavers")
      .map((index) => <GridLine key={index} x={index * pixelPerBeat * scale} color={theme.grid.color[gridType]} />);
  };

  return (
    <svg
      className={styles["grid"]}
      aria-label="pianoroll-grids"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      {...other}
    >
      {gridSeparationFactor.quavers !== 1 ? gridLines("quavers") : []}
      {gridLines("quarter")}
      {gridLines("bar")}
    </svg>
  );
};

interface GridLineProps {
  x: number;
  color: string;
}

const GridLine: React.FC<GridLineProps> = ({ x, color }) => {
  const { canvasHeight } = usePianoRollTransform();

  return <line x1={x} y1={0} x2={x} y2={canvasHeight} stroke={color} strokeWidth="1" />;
};

export default memo(LaneGrids);
