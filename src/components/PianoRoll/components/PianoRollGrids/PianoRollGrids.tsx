import React, { CSSProperties, memo } from 'react';
import styles from './piano-roll-grids.module.scss'
import useStore from "../../hooks/useStore";
import useTheme from "../../hooks/useTheme";

interface PianoRollGridsProps extends React.HTMLAttributes<HTMLDivElement> {}
function PianoRollGrids({ style, ...other }: PianoRollGridsProps) {
  const theme = useTheme();
  const { pianoRollStore } = useStore();
  return (
    <div
      className={styles['grid']}
      style={{
        '--lane-length': `${pianoRollStore.laneLength}px`,
        '--canvas-height': `${pianoRollStore.canvasHeight}px`,
        '--primary-grid-color': theme.grid.primaryGridColor,
        '--secondary-grid-color': theme.grid.secondaryGridColor,
        '--pixel-per-beat': `${pianoRollStore.pixelPerBeat}px`,
        '--piano-lane-scale-x': `${pianoRollStore.pianoLaneScaleX}`,
        ...style
      } as CSSProperties}
      {...other}
    />
  );
};

export default memo(PianoRollGrids)