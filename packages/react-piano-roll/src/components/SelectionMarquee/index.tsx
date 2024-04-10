import styles from "./index.module.scss";
import { MarqueePosition } from "../PianoRoll/handlers/useMarqueeTouchHandler";

interface SelectionMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  marqueePosition: MarqueePosition | null;
}
function SelectionMarquee({ marqueePosition, style }: SelectionMarqueeProps) {
  if (!marqueePosition) {
    return <div className={styles["marquee-container"]} />;
  }

  const startingPositionX = marqueePosition[0].x;
  const startingPositionY = marqueePosition[0].y;
  const ongoingPositionX = marqueePosition[1].x;
  const ongoingPositionY = marqueePosition[1].y;

  const left = Math.min(startingPositionX, ongoingPositionX);
  const right = Math.max(startingPositionX, ongoingPositionX);
  const top = Math.min(startingPositionY, ongoingPositionY);
  const bottom = Math.max(startingPositionY, ongoingPositionY);

  const width = right - left;
  const height = bottom - top;

  return (
    <div className={styles["marquee-container"]}>
      <div
        aria-label="selection-marquee"
        className={styles["selection--marquee"]}
        style={
          {
            "--top": `${top}px`,
            "--left": `${left}px`,
            "--width": `${width}px`,
            "--height": `${height}px`,
            "--background-color": "var(--marquee-fill-color)",
            "--border-color": "var(--marquee-border-color)",
            ...style,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default SelectionMarquee;
