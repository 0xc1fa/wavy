import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.scss";
import { PianoRollLanesMouseHandlerMode, PianoRollMouseHandlersStates } from "../../handlers/usePianoRollMouseHandlers";

interface SelectionMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  mouseHandlersStates: PianoRollMouseHandlersStates;
}
function SelectionMarquee({ mouseHandlersStates, style, ...other }: SelectionMarqueeProps) {
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

  return mouseHandlersStates.mouseHandlerMode === PianoRollLanesMouseHandlerMode.MarqueeSelection ? (
    <div
      aria-label="piano-roll-selection-area"
      className={styles["selection--marquee"]}
      style={
        {
          "--top": `${top}px`,
          "--left": `${left}px`,
          "--width": `${width}px`,
          "--height": `${height}px`,
          "--background-color": theme.selection.selectionAreaFillColor,
          "--border-color": theme.selection.selectionAreaBorderColor,
          ...style,
        } as React.CSSProperties
      }
      {...other}
    />
  ) : (
    <></>
  );
}

export default memo(SelectionMarquee);
