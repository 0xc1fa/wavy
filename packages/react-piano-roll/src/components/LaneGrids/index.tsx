import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from "./index.module.scss";
import { minGridPixel } from "@/constants";
import { ceilToNearestPowerOfTwo, floorToNearestPowerOfTwo } from "@/helpers/number";

interface LaneGridsProps extends React.HTMLAttributes<SVGElement> {}
const LaneGrids: React.FC<LaneGridsProps> = ({ ...other }) => {
  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } =
    usePianoRollTransform();

  const barGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat * 4));
  const quarterGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat));
  const quaversGridSeparationFactor = floorToNearestPowerOfTwo((pianoLaneScaleX * pixelPerBeat) / minGridPixel);

  const numberOfBarGrids = Math.ceil(laneLength / (pixelPerBeat * 4));
  const numberOfQuarterGrids = Math.ceil(laneLength / pixelPerBeat);
  const numberOfQuaversGrids = Math.ceil(laneLength / pixelPerBeat);

  const barGrids = Array.from(
    { length: numberOfBarGrids },
    (_, index) => (
      index % barGridSeparationFactor === 0 ?
      <line
        key={index}
        x1={index * pixelPerBeat * pianoLaneScaleX * 4}
        y1={0}
        x2={index * pixelPerBeat * pianoLaneScaleX * 4}
        y2={canvasHeight}
        stroke={theme.grid.primaryGridColor}
        strokeWidth="1"
      />
      :
      <></>
    ),
  );

  const quarterGrids = Array.from(
    { length: numberOfQuarterGrids },
    (_, index) => (
      index % quarterGridSeparationFactor === 0 ?
      <line
        key={index}
        x1={index * pixelPerBeat * pianoLaneScaleX}
        y1={0}
        x2={index * pixelPerBeat * pianoLaneScaleX}
        y2={canvasHeight}
        stroke={theme.grid.secondaryGridColor}
        strokeWidth="1"
      />
      :
      <></>
    ),
  );

  const quaversGrids = quaversGridSeparationFactor === 1 ?
    []
    :
    Array.from(
      { length: numberOfQuaversGrids },
      (_, index) => (
        <line
          key={index}
          x1={index * (pixelPerBeat * pianoLaneScaleX) / quaversGridSeparationFactor}
          y1={0}
          x2={index * (pixelPerBeat * pianoLaneScaleX) / quaversGridSeparationFactor}
          y2={canvasHeight}
          stroke={theme.grid.ternaryGridColor}
          strokeWidth="1"
        />
      ),
    );

  return (
    <svg
      className={styles["grid"]}
      aria-label="pianoroll-grids"
      width={laneLength * pianoLaneScaleX}
      height={canvasHeight}
      {...other}
    >
      {quaversGrids}
      {quarterGrids}
      {barGrids}
    </svg>
  );
};

export default memo(LaneGrids);
