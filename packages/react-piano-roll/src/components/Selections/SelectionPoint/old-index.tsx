import useStore from "../../../hooks/useStore";
import styles from "./old-index.module.scss";

export default function SelectionPoint() {
  const { pianoRollStore } = useStore();
  const { pixelsPerTick } = pianoRollStore;

  return (
    <div
      className={styles["selection--point"]}
      style={
        {
          "--marker-position": `${pianoRollStore.selectionTicks * pixelsPerTick * pianoRollStore.pianoLaneScaleX}px`,
        } as React.CSSProperties
      }
    />
  );
}
