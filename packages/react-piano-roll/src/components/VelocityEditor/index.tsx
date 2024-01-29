import React, { useState } from "react";
import { usePianoRollNotes } from "../../helpers/notes";
import useStore from "../../hooks/useStore";
import styles from "./index.module.scss";
import LaneGrids from "../LaneGrids";
import useVelocityEditorMouseHandlers from "../../handlers/useVelocityEditorMouseHandlers";
import useTheme from "../../hooks/useTheme";
import VelocityRuler from "./VelocityRuler";

export default function VelocityEditor() {
  const { pianoRollStore } = useStore();
  const theme = useTheme();
  const pianoRollNotes = usePianoRollNotes();
  const [isDragging, setIsDragging] = useState(false);

  const [containerHeight, setContainerHeight] = useState(200);
  const [resizeBuffer, setResizeBuffer] = useState({
    initY: 0,
    initHeight: 0,
  });

  const mouseHandlers = useVelocityEditorMouseHandlers();

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
          <div className={styles["note-bar-container"]} {...mouseHandlers}>
            {pianoRollNotes.map((note) => (
              <div
                key={note.id}
                className={styles["marker-container"]}
                style={
                  {
                    "--marker-left": `${pianoRollStore.getOffsetXFromTick(note.tick)}px`,
                    "--marker-top": `${1 - note.velocity / 128}`,
                    "--marker-width": `${pianoRollStore.getOffsetXFromTick(note.duration)}px`,
                    "--marker-color": note.isSelected ? theme.note.noteBackgroundColor : theme.note.noteBackgroundColor,
                    "--cursor": isDragging ? "grabbing" : "grab",
                  } as React.CSSProperties
                }
                data-id={note.id}
                data-velocity={note.velocity}
              >
                <div className={styles["velocity-marker"]} />
                <div
                  className={styles["length-marker"]}
                  style={{
                    outline: note.isSelected ? `3px solid #ffffff33` : "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
