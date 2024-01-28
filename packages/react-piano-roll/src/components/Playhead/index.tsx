import useStore from "../../hooks/useStore";
import styles from "./index.module.scss";

interface PlayheadProps extends React.HTMLAttributes<HTMLDivElement> {
  playheadPosition: number;
}
export default function Playhead({ playheadPosition }: PlayheadProps) {
  const { pianoRollStore } = useStore();

  return (
    <div
      className={styles["playhead"]}
      style={
        {
          "--playhead-position": `${playheadPosition * pianoRollStore.pixelsPerTick}px`,
        } as React.CSSProperties
      }
    />
  );
}
