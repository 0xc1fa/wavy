import React, { CSSProperties, memo } from 'react';
import styles from './piano-roll-grids.module.scss'
import useTheme from "../../hooks/useTheme";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
interface PianoRollGridsProps extends React.HTMLAttributes<HTMLDivElement> {}
function PianoRollGrids({ style, ...other }: PianoRollGridsProps) {

  const theme = useTheme();
  const { laneLength, canvasHeight, pixelPerBeat, pianoLaneScaleX } = usePianoRollTransform();

  return (
    <div aria-label="piano-roll-grids"
      className={styles['grid']}
      style={{
        '--lane-length': `${laneLength}px`,
        '--canvas-height': `${canvasHeight}px`,
        '--primary-grid-color': theme.grid.primaryGridColor,
        '--secondary-grid-color': theme.grid.secondaryGridColor,
        '--pixel-per-beat': `${pixelPerBeat}px`,
        '--piano-lane-scale-x': `${pianoLaneScaleX}`,
        ...style
      } as CSSProperties}
      {...other}
    />
  );
};

export default memo(PianoRollGrids)
