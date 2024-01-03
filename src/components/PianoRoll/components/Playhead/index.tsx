import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface PlayheadProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function Playhead({  }: PlayheadProps) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles['playhead']}
      style={{ '--playhead-position': `${pianoRollStore.currentTicks * pianoRollStore.pixelsPerTick}px` } as React.CSSProperties}
    />
  )
}