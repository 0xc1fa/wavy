import { basePixelsPerTick } from "@/constants";
import styles from "./index.module.scss";

interface PlayheadProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function Playhead(props: PlayheadProps) {
  return (
    <div
      className={styles["playhead"]}
      style={
        {
          // "--playhead-position": `${playheadPosition * basePixelsPerTick}px`,
        } as React.CSSProperties
      }
    />
  );
}
