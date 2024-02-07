import useStore from "@/hooks/useStore";
import styles from "./index.module.scss";
import { basePixelsPerTick } from "@/constants";
import { canvasHeight } from "@/helpers/conversion";
import { useConfig } from "@/components";

export default function SelectionPoint() {
  const { pianoRollStore } = useStore();
  const { numOfKeys } = useConfig().range;
  const x = pianoRollStore.selectionTicks * basePixelsPerTick * pianoRollStore.pianoLaneScaleX;

  return (
    <svg
      className={styles["selection--point"]}
      aria-label="pianoroll-grids"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <line x1={x} y1={0} x2={x} y2={canvasHeight(numOfKeys)} stroke="#ffffff22" strokeWidth="1" />
    </svg>
  );
}
