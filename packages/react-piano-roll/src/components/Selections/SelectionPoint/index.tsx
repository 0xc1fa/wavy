import useStore from "@/hooks/useStore";
import styles from "./index.module.scss";

export default function SelectionPoint() {
  const { pianoRollStore } = useStore();
  const { pixelsPerTick, canvasHeight } = pianoRollStore;
  const x = pianoRollStore.selectionTicks * pixelsPerTick * pianoRollStore.pianoLaneScaleX

  return (
    <svg
      className={styles["selection--point"]}
      aria-label="pianoroll-grids"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <line x1={x} y1={0} x2={x} y2={canvasHeight} stroke="#ffffff22" strokeWidth="1" />
    </svg>
  )
}