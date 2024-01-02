import { Fragment, memo } from 'react';
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from './index.module.scss'

interface PianoRollRulerProps extends React.HTMLAttributes<SVGElement> {}

const PianoRollRuler: React.FC<PianoRollRulerProps> = ({ ...other }) => {
  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const numberOfBeatMarkers = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX * 4));
  const numberOfBarMarkers = Math.ceil(laneLength / (pixelPerBeat * pianoLaneScaleX));

  const rulerHeight = 30

  const beatMarkers = Array.from({ length: numberOfBeatMarkers }, (_, index) => (
    <Fragment key={index}>
      <line
        key={index}
        x1={index * pixelPerBeat * pianoLaneScaleX * 4}
        y1={5}
        x2={index * pixelPerBeat * pianoLaneScaleX * 4}
        y2={rulerHeight}
        // stroke={theme.grid.primaryGridColor}
        stroke="#232323"
        strokeWidth="1"
      />
      <text
        x={index * pixelPerBeat * pianoLaneScaleX * 4 + 5} // Adjust text position as needed
        y={13} // Adjust text position as needed
        className={styles['text']}
        fill="#232323" // Text color
        fontSize="13" // Adjust font size as needed
      >
        {index + 1}
      </text>
    </Fragment>
  ));

  const barMarkers = Array.from({ length: numberOfBarMarkers }, (_, index) => (
    <line
      x1={index * pixelPerBeat * pianoLaneScaleX}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX}
      y2={10}
      // stroke={theme.grid.secondaryGridColor}
      stroke="#232323"
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
      {/* {barMarkers} */}
    </svg>
  );
};

export default memo(PianoRollRuler);
