import { memo } from 'react';
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from './index.module.scss'

interface PianoRollRulerProps extends React.HTMLAttributes<SVGElement> {}

const PianoRollRuler: React.FC<PianoRollRulerProps> = ({ ...other }) => {
  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const numberOfBeatMarkers = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX * 4));
  const numberOfBarMarkers = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX));
  // const numberOfPrimaryLines = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX * 4));
  // const numberOfSecondaryLines = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX));

  const beatMarkers = Array.from({ length: numberOfBeatMarkers }, (_, index) => (
    <line
      key={index}
      x1={index * pixelPerBeat * pianoLaneScaleX * 4}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX * 4}
      y2={10}
      // stroke={theme.grid.primaryGridColor}
      stroke="red"
      strokeWidth="1"
    />
  ));

  const barMarkers = Array.from({ length: numberOfBarMarkers }, (_, index) => (
    <line
      key={index}
      x1={index * pixelPerBeat * pianoLaneScaleX}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX}
      y2={10}
      // stroke={theme.grid.secondaryGridColor}
      stroke="red"
      strokeWidth="1"
    />
  ));

  return (
    <svg
      aria-label="pianoroll-ruler"
      width={laneLength}
      height={canvasHeight}
      {...other}
      className={styles['ruler']}
    >
      {beatMarkers}
      {barMarkers}
    </svg>
  );
};

export default memo(PianoRollRuler);
