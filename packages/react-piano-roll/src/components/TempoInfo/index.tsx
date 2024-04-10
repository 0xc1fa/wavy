import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { useAtom } from "jotai";
import { bpmAtom } from "@/store/bpm";

const handleDoubleClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
  event?.currentTarget.focus();
};

export default function TempoInfo() {
  const [bpm, setBpm] = useAtom(bpmAtom);

  const [isDragging, setIsDragging] = useState(false);
  const [inintialY, setInitialY] = useState(0);

  const [inputValue, setInputValue] = useState(bpm.toString());
  const bufferedValue = useRef(inputValue);

  useEffect(() => {
    setInputValue(bpm.toString());
  }, [bpm]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.currentTarget.value);
  };

  const handlePointerDown: React.PointerEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setInitialY(event.clientY);
    bufferedValue.current = inputValue;
  };

  const handlePointerMove: React.PointerEventHandler<HTMLInputElement> = (event) => {
    if (isDragging) {
      const newValue = parseFloat(bufferedValue.current) - (event.clientY - inintialY);
      const clampedValue = Math.max(40, Math.min(200, newValue));
      setInputValue(Math.round(clampedValue).toString());
    }
  };

  const handlePointerUp: React.PointerEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      const value = parseFloat(inputValue);
      if (!isNaN(value)) {
        const clampedValue = Math.max(40, Math.min(200, value));
        setBpm(clampedValue);
        setInputValue(clampedValue.toString());
      } else {
        setInputValue(bpm.toString());
      }
      event.currentTarget.blur();
    }
  };

  return (
    <input
      className={styles["tempo-info"]}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
}
