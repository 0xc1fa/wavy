import { baseLaneWidth } from "@/constants";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { isBlackKey } from "@/helpers";
import { baseCanvasHeight } from "@/helpers/conversion";
import styles from "./index.module.scss";

export default function Lane({ noteNumber }: { noteNumber: number }) {
  const { numOfKeys } = useConfig().pitchRange;
  const yPosition = baseCanvasHeight(numOfKeys) - (noteNumber + 1) * baseLaneWidth;

  return (
    <rect
      data-note-num={noteNumber}
      className={[styles.lane, isBlackKey(noteNumber) ? styles.blackLane : styles.whiteLane].join(" ")}
      key={noteNumber}
      width="100%"
      y={yPosition}
    />
  );
}
