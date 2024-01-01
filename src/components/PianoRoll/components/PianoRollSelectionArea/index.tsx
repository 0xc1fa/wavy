import { memo } from "react";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import useTheme from "../../hooks/useTheme";
import styles from "./piano-roll-selection-area.module.scss";
import { PianoRollLanesMouseHandlerMode, PianoRollMouseHandlersStates } from "../../hooks/usePianoRollMouseHandler";

interface PianoRollSelectionAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  mouseHandlersStates: PianoRollMouseHandlersStates
}
function PianoRollSelectionArea({ mouseHandlersStates, style, ...other }: PianoRollSelectionAreaProps) {

  // const transform = usePianoRollTransform();
  const theme = useTheme();

  const startingPositionX = mouseHandlersStates.startingPosition.x;
  const startingPositionY = mouseHandlersStates.startingPosition.y;
  const ongoingPositionX = mouseHandlersStates.ongoingPosition.x;
  const ongoingPositionY = mouseHandlersStates.ongoingPosition.y;

  const left = Math.min(startingPositionX, ongoingPositionX);
  const right = Math.max(startingPositionX, ongoingPositionX);
  const top = Math.min(startingPositionY, ongoingPositionY);
  const bottom = Math.max(startingPositionY, ongoingPositionY);

  const width = right - left;
  const height = bottom - top;

  return (
    mouseHandlersStates.mouseHandlerMode === PianoRollLanesMouseHandlerMode.MarqueeSelection ?
    <div aria-label="piano-roll-selection-area"
      className={styles['selection-area']}
      style={{
        '--top': `${top}px`,
        '--left': `${left}px`,
        '--width': `${width}px`,
        '--height': `${height}px`,
        '--background-color': theme.selection.selectionAreaFillColor,
        '--border-color': theme.selection.selectionAreaBorderColor,
        ...style
      } as React.CSSProperties}
      {...other}
    />
    :
    <></>
  )
}

export default memo(PianoRollSelectionArea)
