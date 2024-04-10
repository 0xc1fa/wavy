import { memo } from "react";
import styles from "./index.module.scss";
import { getGridBaseSeparation, getGridSeparationFactor, getNumOfGrid } from "@/helpers/grid";
import { basePixelsPerBeat } from "@/constants";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";

const LaneGrids: React.FC = memo(() => {
  const { tickRange, timeSignature } = useConfig();

  const { scaleX } = useScaleX();

  const gridSeparationFactor = getGridSeparationFactor(timeSignature![0], scaleX);
  const numberOfGrids = getNumOfGrid(baseCanvasWidth(tickRange), scaleX);
  const gridBaseSeparation = getGridBaseSeparation(gridSeparationFactor);

  const gridLines = (gridType: "bar" | "quarter" | "quavers") => {
    const scale = scaleX * gridBaseSeparation[gridType];
    return [...Array(numberOfGrids[gridType]).keys()]
      .filter((index) => index % gridSeparationFactor[gridType] === 0 || gridType === "quavers")
      .map((index) => (
        <GridLine key={index} x={index * basePixelsPerBeat * scale} className={styles[gridType]} />
      ));
  };

  return (
    <svg className={styles["container"]} width="100%" height="100%" preserveAspectRatio="none">
      {gridSeparationFactor.quavers !== 1 ? gridLines("quavers") : []}
      {gridLines("quarter")}
      {gridLines("bar")}
    </svg>
  );
});

interface GridLineProps {
  x: number;
  className: string;
}

const GridLine: React.FC<GridLineProps> = (props) => {
  return <line x1={props.x} y1="0" x2={props.x} y2="100%" strokeWidth="1" preserveAspectRatio="none" className={props.className} />;
};

export default LaneGrids;
