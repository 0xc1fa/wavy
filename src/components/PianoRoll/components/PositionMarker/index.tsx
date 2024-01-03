import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface PositionMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function PositionMarker({  }: PositionMarkerProps) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles['position-marker']}
      style={{ '--position-marker-position': `${pianoRollStore.selectionTicks * pianoRollStore.pixelsPerTick}px` } as React.CSSProperties}
    />
  )
}
