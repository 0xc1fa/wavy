import { memo } from "react";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.scss";

interface LanesBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}
function LanesBackground({ style, ...other } : LanesBackgroundProps) {

  // const { pianoRollStore } = useStore();
  const transform = usePianoRollTransform();
  const theme = useTheme();

  return (
    <div aria-label="piano-roll-lanes-background"
      className={styles['lanes']}
      style={{
        '--canvas-width': `${transform.canvasWidth}px`,
        '--canvas-height': `${transform.canvasHeight}px`,
        '--white-lane-color': theme.lane.whiteLaneColor,
        '--black-lane-color': theme.lane.blackLaneColor,
        '--piano-lane-scale-x': `${transform.pianoLaneScaleX}`,
        '--lane-width': `${transform.laneWidth}px`,
        ...style
      } as React.CSSProperties}
      {...other}
    />
  )
}

export default memo(LanesBackground)