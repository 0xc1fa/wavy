import { memo } from 'react';
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";

interface PianoRollGridsProps extends React.HTMLAttributes<SVGElement> {}

const PianoRollGrids: React.FC<PianoRollGridsProps> = ({ ...other }) => {
  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const numberOfPrimaryLines = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX * 4));
  const numberOfSecondaryLines = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX));

  const primaryLines = Array.from({ length: numberOfPrimaryLines }, (_, index) => (
    <line
      key={index}
      x1={index * pixelPerBeat * pianoLaneScaleX * 4}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX * 4}
      y2={canvasHeight}
      stroke={theme.grid.primaryGridColor}
      strokeWidth="1"
    />
  ));

  const secondaryLines = Array.from({ length: numberOfSecondaryLines }, (_, index) => (
    <line
      key={index}
      x1={index * pixelPerBeat * pianoLaneScaleX}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX}
      y2={canvasHeight}
      stroke={theme.grid.secondaryGridColor}
      strokeWidth="1"
    />
  ));

  return (
    <svg
      aria-label="pianoroll-grids"
      width={laneLength}
      height={canvasHeight}
      {...other}
    >
      {secondaryLines}
      {primaryLines}
    </svg>
  );
};

export default memo(PianoRollGrids);
