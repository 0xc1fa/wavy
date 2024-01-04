import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface PositionMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function PositionMarker({  }: PositionMarkerProps) {
  const { pianoRollStore } = useStore();

  const className =
    pianoRollStore.selectionRange.mode === 'range' ?
    `${styles['selection']} ${styles['selection--range']}` :
    `${styles['selection']} ${styles['selection--point']}`

  return (
    pianoRollStore.selectionRange.mode === 'none' ?
    <></>
    :
    <div className={className}
      style={{
        '--left-marker-position': `${pianoRollStore.selectionRange.start * pianoRollStore.pixelsPerTick}px`,
        '--selection-width': `${pianoRollStore.selectionRange.range * pianoRollStore.pixelsPerTick}px`
      } as React.CSSProperties}
    />
  )
}
