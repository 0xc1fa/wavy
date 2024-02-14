import { memo } from "react";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.scss";
import { PianoRollLanesMouseHandlerMode, PianoRollMouseHandlersStates } from "../../handlers/usePianoRollMouseHandlers";

interface SelectionMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  mouseHandlersStates: PianoRollMouseHandlersStates;
}
function SelectionMarquee({ mouseHandlersStates, style }: SelectionMarqueeProps) {
  const theme = useTheme();

  const startingPositionX = mouseHandlersStates.startingPosition.current.x;
  const startingPositionY = mouseHandlersStates.startingPosition.current.y;
  const ongoingPositionX = mouseHandlersStates.ongoingPosition.current.x;
  const ongoingPositionY = mouseHandlersStates.ongoingPosition.current.y;

  const left = Math.min(startingPositionX, ongoingPositionX);
  const right = Math.max(startingPositionX, ongoingPositionX);
  const top = Math.min(startingPositionY, ongoingPositionY);
  const bottom = Math.max(startingPositionY, ongoingPositionY);

  const width = right - left;
  const height = bottom - top;

  return mouseHandlersStates.mouseHandlerMode === PianoRollLanesMouseHandlerMode.MarqueeSelection ? (
    <div className={styles["marquee-container"]}>
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
    />
    </div>
  ) : (
    <></>
  );
}

export default SelectionMarquee;
