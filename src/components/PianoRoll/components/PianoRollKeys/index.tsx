import { isBlackKey } from "../../helpers";
import useStore from "../../hooks/useStore";
import useTheme from "../../hooks/useTheme";
import styles from './index.module.scss'

interface PianoRollKeysProps extends React.HTMLAttributes<HTMLCanvasElement> {
}
export default function PianoRollKeys(props: PianoRollKeysProps) {

  const { pianoRollStore } = useStore();

  const keyNums = [];
  for (let i = pianoRollStore.endingNoteNum - 1; i >= pianoRollStore.startingNoteNum; i--) {
    keyNums.push(i);
  }

  const handlerPointerDown: React.PointerEventHandler = event => {
    const currentTarget = event.currentTarget as HTMLDivElement;
    // currentTarget.setPointerCapture(event.pointerId);
    currentTarget.classList.add(styles['key--pressed'])
    const handleMouseLeave = () => {
      currentTarget.classList.remove(styles['key--pressed']);
      // Clean up: remove the event listener after it's fired
      currentTarget.removeEventListener('mouseleave', handleMouseLeave);
    };
    currentTarget.addEventListener('mouseleave', handleMouseLeave);
  }

  let currentY = -pianoRollStore.whiteKeyWidth

  return (
    <div className={styles['container']}>
    {keyNums.map(keyNum => {
      if (isBlackKey(keyNum)) return (
        <div className={`${styles['key']} ${styles['black__key']}`}
          data-keynum={keyNum}
          style={{
            '--key-top': `${pianoRollStore.getMinYFromNoteNum(keyNum)}px`,
          } as React.CSSProperties}
          onPointerDown={handlerPointerDown}
        >
          <span hidden={keyNum % 12 !== 0}>{pianoRollStore.getNoteNameFromNoteNum(keyNum)}</span>
        </div>
      )
      else {
        currentY += pianoRollStore.whiteKeyWidth
        return (
          <div className={`${styles['key']} ${styles['white__key']}`}
            data-keynum={keyNum}
            style={{
              '--key-top': `${currentY}px`,
              paddingLeft: '40%',
              paddingTop: `${pianoRollStore.getMinYFromNoteNum(keyNum) - currentY}px`,
              paddingBottom: `${(25 * (12/7)) - (pianoRollStore.getMinYFromNoteNum(keyNum) - currentY) - 25}px`,
            } as React.CSSProperties}
            onPointerDown={handlerPointerDown}
          >
            <span hidden={keyNum % 12 !== 0}>{pianoRollStore.getNoteNameFromNoteNum(keyNum)}</span>
          </div>
        )
      }
    })}
    </div>
  )
}