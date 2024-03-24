import { basePixelsPerTick } from "@/constants";
import styles from "./index.module.scss";

interface PlayheadProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTime: number;
}
export default function Playhead(props: PlayheadProps) {
  return (
    <div
      className={styles["playhead"]}
      style={
        {
          "--playhead-position": `${props.currentTime * basePixelsPerTick}px`,
        } as React.CSSProperties
      }
    />
  );
}
