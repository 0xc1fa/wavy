import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import styles from './index.module.scss'

interface RulerProps extends React.HTMLAttributes<SVGElement> {}
export default function SelectionBar({ ...other }: RulerProps) {
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  const numberOfBeatMarkers = Math.ceil(laneLength / (pixelPerBeat * 4));
  const numberOfHalfBarMarkers = Math.ceil(laneLength / (pixelPerBeat));
  const numberOfBarMarkers = Math.ceil(laneLength / (pixelPerBeat));

  const rulerHeight = 30

  const beatMarkers = Array.from({ length: numberOfBeatMarkers }, (_, index) => (
    <g key={index}>
      <line
        key={index}
        x1={index * pixelPerBeat * pianoLaneScaleX * 4}
        y1={0}
        x2={index * pixelPerBeat * pianoLaneScaleX * 4}
        y2={rulerHeight-21}
        // stroke={theme.grid.primaryGridColor}
        stroke="#232323"
        strokeWidth="1"
      />
    </g>
  ));

  const barMarkers = Array.from({ length: numberOfBarMarkers }, (_, index) => (
    <line
      x1={index * pixelPerBeat * pianoLaneScaleX}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX}
      y2={rulerHeight-27}
      // stroke={theme.grid.secondaryGridColor}
      stroke="#232323"
      strokeWidth="1"
    />
  ));

  const halfBarMarkers = Array.from({ length: numberOfHalfBarMarkers }, (_, index) => (
    <line
      x1={index * pixelPerBeat * pianoLaneScaleX * 2}
      y1={0}
      x2={index * pixelPerBeat * pianoLaneScaleX * 2}
      y2={rulerHeight-24}
      // stroke={theme.grid.secondaryGridColor}
      stroke="#232323"
      strokeWidth="1"
    />
  ));

  return (
    <div onClick={(event) => console.log(event.nativeEvent.offsetX)}
      className={styles['ruler-container']}
    >
      <svg
        aria-label="pianoroll-ruler"
        width="100%"
        height="100%"
        {...other}
        preserveAspectRatio="none"
        className={styles['ruler']}
      >
        {beatMarkers}
        {barMarkers}
        {halfBarMarkers}
      </svg>
    </div>
  );
}