import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.scss";
import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import { basePixelsPerBeat } from "@/constants";
import useStore from "@/hooks/useStore";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";

interface LaneGridsProps extends React.HTMLAttributes<SVGElement> {
  scaleX?: number;
}
const LaneGrids: React.FC<LaneGridsProps> = ({ ...other }) => {
  const theme = useTheme();
  const { pianoRollStore } = useStore();
  const { tickRange } = useConfig();

  const gridSeparationFactor = getGridSeparationFactor(pianoRollStore.pianoLaneScaleX);
  const numberOfGrids = getNumOfGrid(baseCanvasWidth(tickRange));
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);

  const gridLines = (gridType: "bar" | "quarter" | "quavers") => {
    const scale = pianoRollStore.pianoLaneScaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0 || gridType === "quavers")
      .map((index) => (
        <GridLine key={index} x={index * basePixelsPerBeat * scale} color={theme.grid.color[gridType]} />
      ));
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
  return <line x1={x} y1="0" x2={x} y2="100%" stroke={color} strokeWidth="1" preserveAspectRatio="none" />;
};

export default memo(LaneGrids);
