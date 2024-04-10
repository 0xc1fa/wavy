import React, { useState } from "react";
import styles from "./index.module.scss";
import LaneGrids from "../LaneGrids";
import VelocityRuler from "./VelocityRuler";;
import NoteBars from "./NoteBars";

function useVelocityEditorGeometry() {
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState(200);
  const [resizeBuffer, setResizeBuffer] = useState({
    initY: 0,
    initHeight: 0,
  });

  return {
    isDragging,
    containerHeight,
    resizeBuffer,
    setIsDragging,
    setContainerHeight,
    setResizeBuffer,
  }
}

function useHandlePointerDown(geometry: ReturnType<typeof useVelocityEditorGeometry>): React.PointerEventHandler {
  return (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    geometry.setIsDragging(true);
    geometry.setResizeBuffer({
      initY: event.clientY,
      initHeight: geometry.containerHeight,
    });
  };
};

function useHandlePointerMove(geometry: ReturnType<typeof useVelocityEditorGeometry>): React.PointerEventHandler {
  return (event) => {
    if (geometry.isDragging) {
      const newHeight = geometry.resizeBuffer.initHeight - (event.clientY - geometry.resizeBuffer.initY);
      geometry.setContainerHeight(Math.max(50, Math.min(300, newHeight)));
    }
  };
};

function useHandlePointerUp(geometry: ReturnType<typeof useVelocityEditorGeometry>): React.PointerEventHandler {
  return () => {
    geometry.setIsDragging(false);
  };
};

export default function VelocityEditor() {
  const geometry = useVelocityEditorGeometry();

  const resizeBarHandlers = {
    onPointerDown: useHandlePointerDown(geometry),
    onPointerMove: useHandlePointerMove(geometry),
    onPointerUp: useHandlePointerUp(geometry),
  };

  return (
    <div className={styles["outer-container"]}>
      <div className={styles["resize-bar"]} {...resizeBarHandlers} />
      <div
        className={styles["inner-container"]}
        style={
          {
            "--container-height": `${geometry.containerHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className={styles["left-container"]}>
          <VelocityRuler height={geometry.containerHeight} />
        </div>
        <div className={styles["right-container"]}>
          <LaneGrids />
          <NoteBars isDragging={geometry.isDragging} />
        </div>
      </div>
    </div>
  );
}
