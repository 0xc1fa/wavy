import useStore from "../../hooks/useStore";
import styles from './index.module.scss';

interface PianoRollPlayHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  // ticks: number;
}
export default function PianoRollPlayHead({  }: PianoRollPlayHeadProps) {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles['playhead']}
      style={{ '--ticks': pianoRollStore.currentTicks, '--pixel-per-tick': pianoRollStore.pixelsPerTick } as React.CSSProperties}
    />
  )
}