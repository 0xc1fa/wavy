import { baseWhiteKeyWidth } from "@/constants";
import { isBlackKey } from "../../helpers";
import useStore from "../../hooks/useStore";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.scss";
import { canvasHeight, getMinYFromNoteNum, getNoteNameFromNoteNum } from "@/helpers/conversion";
import { useConfig } from "..";

interface PianoKeyboardProps extends React.HTMLAttributes<HTMLCanvasElement> {}
export default function PianoKeyboard(props: PianoKeyboardProps) {
  const { startingNoteNum, numOfKeys } = useConfig().range;

  const keyNums = [];
  for (let i = startingNoteNum; i < startingNoteNum + numOfKeys; i++) {
    keyNums.push(i);
  }

  const handlerPointerDown: React.PointerEventHandler = (event) => {
    const currentTarget = event.currentTarget as HTMLDivElement;
    // currentTarget.setPointerCapture(event.pointerId);
    currentTarget.classList.add(styles["key--pressed"]);
    const handleMouseLeave = () => {
      currentTarget.classList.remove(styles["key--pressed"]);
      // Clean up: remove the event listener after it's fired
      currentTarget.removeEventListener("mouseleave", handleMouseLeave);
    };
    currentTarget.addEventListener("mouseleave", handleMouseLeave);
  };

  let currentY = canvasHeight(numOfKeys);

  return (
    <div className={styles["container"]}>
      {keyNums.map((keyNum) => {
        if (isBlackKey(keyNum))
          return (
            <div
              key={keyNum}
              className={`${styles["key"]} ${styles["black__key"]}`}
              data-keynum={keyNum}
              style={
                {
                  "--key-top": `${getMinYFromNoteNum(numOfKeys, keyNum)}px`,
                } as React.CSSProperties
              }
              onPointerDown={handlerPointerDown}
            >
              <span hidden={keyNum % 12 !== 0}>{getNoteNameFromNoteNum(keyNum)}</span>
            </div>
          );
        else if (keyNum !== 127) {
          currentY -= baseWhiteKeyWidth;
          return (
            <div
              key={keyNum}
              className={`${styles["key"]} ${styles["white__key"]}`}
              data-keynum={keyNum}
              style={
                {
                  "--key-top": `${currentY}px`,
                  paddingLeft: "40%",
                  paddingTop: `${getMinYFromNoteNum(numOfKeys, keyNum) - currentY}px`,
                  paddingBottom: `${25 * (12 / 7) - (getMinYFromNoteNum(numOfKeys, keyNum) - currentY) - 25}px`,
                } as React.CSSProperties
              }
              onPointerDown={handlerPointerDown}
            >
              <span hidden={keyNum % 12 !== 0}>{getNoteNameFromNoteNum(keyNum)}</span>
            </div>
          );
        } else {
          return (
            <div
              key={keyNum}
              className={`${styles["key"]} ${styles["white__key"]}`}
              data-keynum={keyNum}
              style={
                {
                  "--key-top": `0px`,
                  "--white-key-height": `${currentY}px`,
                } as React.CSSProperties
              }
              onPointerDown={handlerPointerDown}
            >
              <span hidden={keyNum % 12 !== 0}>{getNoteNameFromNoteNum(keyNum)}</span>
            </div>
          );
        }
      })}
    </div>
  );
}
