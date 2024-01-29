import { basePixelsPerTick } from "@/constants";
import useStore from "../../../hooks/useStore";
import styles from "./old-index.module.scss";

export default function SelectionPoint() {
  const { pianoRollStore } = useStore();

  return (
    <div
      className={styles["selection--point"]}
      style={
        {
          "--marker-position": `${pianoRollStore.selectionTicks * basePixelsPerTick * pianoRollStore.pianoLaneScaleX}px`,
        } as React.CSSProperties
      }
    />
  );
}
