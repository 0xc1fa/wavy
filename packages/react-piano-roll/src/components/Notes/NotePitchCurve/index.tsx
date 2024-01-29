import React, { memo } from "react";
// import { TrackNoteEvent, VibratoMode } from "@/types"; // Update these imports as necessary
import useTheme from "../../../hooks/useTheme";
import useStore from "../../../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";

interface NotePitchCurveProps extends React.SVGProps<SVGSVGElement> {
  note: TrackNoteEvent;
}

const NotePitchCurve: React.FC<NotePitchCurveProps> = ({ note, ...other }) => {
  const theme = useTheme();
  const { pianoRollStore } = useStore();

  // Function to draw a point (circle in SVG)
  const drawPoint = (x: number, y: number, filled: boolean = true) => {
    const radius = theme.curve.pitchBendCurvePointRaduis;
    const fill = filled ? theme.curve.pitchBendCurveColor : "none";
    const stroke = theme.curve.pitchBendCurveColor;
    return <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} />;
  };

  // Function to draw a line (line in SVG)
  const drawLine = (x1: number, x2: number, y: number) => {
    return (
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={theme.curve.pitchBendCurveColor}
        strokeWidth={theme.curve.pitchBendCurveLineWidth}
      />
    );
  };

  // Function to draw the vibrato curve line (path in SVG)
  const drawVibratoCurveLine = (note: TrackNoteEvent, x1: number, x2: number, y: number) => {
    // Implement the logic for the vibrato curve here
    // For the sake of example, let's assume it's a simple sine wave
    const pathData = [];
    for (let x = x1; x <= x2; x += 1) {
      const yOffset = Math.sin((x - x1) / note.vibratoRate) * note.vibratoDepth;
      pathData.push(`L ${x} ${y + yOffset}`);
    }

    return (
      <path
        d={`M ${x1} ${y} ${pathData.join(" ")}`}
        fill="none"
        stroke={theme.curve.pitchBendCurveColor}
        strokeWidth={theme.curve.pitchBendCurveLineWidth}
      />
    );
  };

  const { laneLength, canvasHeight } = pianoRollStore;

  // Extract needed values from the note and store
  const noteStartingX = pianoRollStore.getOffsetXFromTick(note.tick);
  const noteEndingX = pianoRollStore.getOffsetXFromTick(note.tick + note.duration);
  const noteVibratoStartX = pianoRollStore.getOffsetXFromTick(note.tick + note.vibratoDelay);
  const noteCenterY = pianoRollStore.getCenterYFromNoteNum(note.noteNumber);

  return (
    <svg
      aria-label="piano-roll-pitch-curve"
      width={laneLength}
      height={canvasHeight}
      style={{ position: "absolute" }}
      {...other}
    >
      {drawPoint(noteStartingX, noteCenterY)}
      {drawLine(noteStartingX, noteVibratoStartX, noteCenterY)}
      {drawPoint(noteEndingX, noteCenterY)}
      {drawVibratoCurveLine(note, noteVibratoStartX, noteEndingX, noteCenterY)}
      {drawPoint(noteVibratoStartX, noteCenterY, false)}
    </svg>
  );
};

export default memo(NotePitchCurve);
