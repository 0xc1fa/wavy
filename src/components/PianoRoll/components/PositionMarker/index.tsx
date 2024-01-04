import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface PositionMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function PositionMarker({  }: PositionMarkerProps) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles['position-marker']}
      style={{
        '--left-marker-position': `${pianoRollStore.selectionRange.start * pianoRollStore.pixelsPerTick}px`,
        '--selection-width': `${pianoRollStore.selectionRange.range * pianoRollStore.pixelsPerTick}px`
      } as React.CSSProperties}
    />
  )
}
