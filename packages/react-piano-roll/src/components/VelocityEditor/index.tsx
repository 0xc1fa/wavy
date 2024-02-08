import React, { useState } from "react";
import { useStore } from "@/hooks/useStore";
import styles from "./index.module.scss";
import LaneGrids from "../LaneGrids";
import useVelocityEditorMouseHandlers from "../../handlers/useVelocityEditorMouseHandlers";
import useTheme from "../../hooks/useTheme";
import VelocityRuler from "./VelocityRuler";
import { getOffsetXFromTick } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";
import NoteBars from "./NoteBars";

export default function VelocityEditor() {
  const [isDragging, setIsDragging] = useState(false);

  const [containerHeight, setContainerHeight] = useState(200);
  const [resizeBuffer, setResizeBuffer] = useState({
    initY: 0,
    initHeight: 0,
  });

  const handlePointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setResizeBuffer({
      initY: event.clientY,
      initHeight: containerHeight,
    });
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isDragging) {
      const newHeight = resizeBuffer.initHeight - (event.clientY - resizeBuffer.initY);
      setContainerHeight(Math.max(50, Math.min(300, newHeight)));
    }
  };

  const handlePointerUp: React.PointerEventHandler = (event) => {
    setIsDragging(false);
  };

  const resizeBarHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  return (
    <div className={styles["outer-container"]}>
      <div className={styles["resize-bar"]} {...resizeBarHandlers} />
      <div
        className={styles["inner-container"]}
        style={
          {
            "--container-height": `${containerHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className={styles["left-container"]}>
          <VelocityRuler height={containerHeight} />
        </div>
        <div className={styles["right-container"]}>
          <LaneGrids />
          <NoteBars isDragging={isDragging} />
        </div>
      </div>
    </div>
  );
}
