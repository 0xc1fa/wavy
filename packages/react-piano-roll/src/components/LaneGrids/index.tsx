import { memo } from "react";
import useTheme from "@/hooks/useTheme";
import styles from "./index.module.scss";
import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import { basePixelsPerBeat } from "@/constants";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";

const LaneGrids: React.FC = memo(() => {
  const theme = useTheme();
  const { tickRange, beatsPerBar } = useConfig();

  const { scaleX } = useScaleX();

  const gridSeparationFactor = getGridSeparationFactor(beatsPerBar!, scaleX);
  const numberOfGrids = getNumOfGrid(baseCanvasWidth(tickRange), scaleX);
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);

  const gridLines = (gridType: "bar" | "quarter" | "quavers") => {
    const scale = scaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0 || gridType === "quavers")
      .map((index) => (
        <GridLine key={index} x={index * basePixelsPerBeat * scale} color={theme.grid.color[gridType]} />
      ));
  };

  return (
    <svg className={styles["grid"]} aria-label="pianoroll-grids" width="100%" height="100%" preserveAspectRatio="none">
      {gridSeparationFactor.quavers !== 1 ? gridLines("quavers") : []}
      {gridLines("quarter")}
      {gridLines("bar")}
    </svg>
  );
});

interface GridLineProps {
  x: number;
  color: string;
}

const GridLine: React.FC<GridLineProps> = ({ x, color }) => {
  return <line x1={x} y1="0" x2={x} y2="100%" stroke={color} strokeWidth="1" preserveAspectRatio="none" />;
};

export default LaneGrids;
