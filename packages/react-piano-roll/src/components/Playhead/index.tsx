import { basePixelsPerTick } from "@/constants";
import styles from "./index.module.scss";
import { useScaleX } from "@/contexts/ScaleXProvider";

interface PlayheadProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTime: number;
}
export default function Playhead(props: PlayheadProps) {
  const { scaleX } = useScaleX();
  return (
    <div
      className={styles["playhead"]}
      style={
        {
          "--playhead-position": `${props.currentTime * basePixelsPerTick * scaleX}px`,
        } as React.CSSProperties
      }
    />
  );
}
