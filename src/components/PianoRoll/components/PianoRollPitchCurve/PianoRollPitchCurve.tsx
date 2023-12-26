import { debug } from "../../helpers";
import Canvas from "@/common/components/Canvas";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { memo, useCallback } from "react";
import useTheme from "../../hooks/useTheme";
import { VibratoMode } from "@/types/VibratoMode";
import useStore from "../../hooks/useStore";

interface PianoRollPitchCurveProps extends React.HTMLAttributes<HTMLCanvasElement> {
}
function PianoRollPitchCurve({ style, ...other }: PianoRollPitchCurveProps) {

  const { pianoRollStore } = useStore()
  const theme = useTheme()

  function drawPianoRollPitchCurve(
    ctx: CanvasRenderingContext2D,
  ) {
    const radius = theme.curve.pitchBendCurvePointRaduis
    const lineWidth = theme.curve.pitchBendCurveLineWidth
    const color = theme.curve.pitchBendCurveColor

    const drawBreakpoint = (
      x: number, y: number,
      filled: boolean = true,
    ) => {
      const configCtx = () => {
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
      }
      const drawFilledPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, radius + lineWidth / 2, 0, 2 * Math.PI, false);
        ctx.fill();
      }
      const drawHollowPoint = () => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
      }

      configCtx();
      if (filled) drawFilledPoint(); else drawHollowPoint();
    }

    const drawHorizontalLine = (
      x1: number, x2: number, y: number,
    ) => {
      const configCtx = () => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
      }
      const drawLine = () => {
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }

      configCtx();
      drawLine();
    }

    const drawVibratoCurveLine = (
      x1: number, x2: number, y: number,
      amplitude: number, rate: number,
      mode: VibratoMode
    ) =>  {
      const range = x2 - x1;
      const multiplier = 0.13 * amplitude;
      const fadeOutPercents = 0.95;
      const attackTime = 0.05 * (x2 - x1);
      const ensureNonNegative = (x: number) => Math.max(0, x);
      const sineFunction = (x: number) => multiplier * Math.sin(x / rate);
      const linearFunction = (x: number) => (1 - x / attackTime) * 0.1;
      const fadeOutFunction = (x: number) => (Math.cos(Math.PI * ensureNonNegative(x - fadeOutPercents * range) / ((1 - fadeOutPercents) * range)) + 1) / 2;
      const drawCurvePoints = () => {
        const drawPoint = (x: number, fx: number) => ctx.lineTo(x1 + x, fx + y);
        for (let x = 0; x < x2 - x1; x++) {
          let fx = (mode === VibratoMode.Linear) ? (sineFunction(x) * linearFunction(x)) : sineFunction(x);
          fx = (x > fadeOutPercents * (x2 - x1)) ? (fx * fadeOutFunction(x)) : fx;
          drawPoint(x, fx);
        }
      }
      const toStartingPosition = () => {ctx.beginPath(); ctx.moveTo(x1, y);}

      toStartingPosition();
      drawCurvePoints();
      ctx.stroke();
    }

    const drawPitchCurve = (note: TrackNoteEvent) => {
      const getXYPosition = () => {
        const noteStartingX = pianoRollStore.getOffsetXFromTick(note.tick);
        const noteEndingX = pianoRollStore.getOffsetXFromTick(note.tick+note.duration);
        const noteVibratoStartX = pianoRollStore.getOffsetXFromTick(note.tick+note.vibratoDelay);
        const noteCenterY = pianoRollStore.getCenterYFromNoteNum(note.noteNumber);
        return { noteStartingX, noteEndingX, noteVibratoStartX, noteCenterY };
      }

      const drawBreakpointAndCurve = () => {
        drawBreakpoint(noteStartingX, noteCenterY);
        drawHorizontalLine(noteStartingX + radius, noteVibratoStartX - radius, noteCenterY)
        drawBreakpoint(noteEndingX, noteCenterY);
        drawVibratoCurveLine(
          noteVibratoStartX + radius, noteEndingX - radius, noteCenterY,
          note.vibratoDepth, pianoRollStore.getOffsetXFromTick(note.vibratoRate), note.vibratoMode
        );
        drawBreakpoint(noteVibratoStartX, noteCenterY, false);
      }

      const{ noteStartingX, noteEndingX, noteVibratoStartX, noteCenterY } = getXYPosition();
      drawBreakpointAndCurve();
    }

    debug(drawPianoRollPitchCurve.name);
    pianoRollStore.clearCanvas(ctx);
    for (const note of pianoRollStore.pianoRollNotes) drawPitchCurve(note);
  }

  return (
    <Canvas aria-label="piano-roll-pitch-curve"
      style={style}
      width={pianoRollStore.laneLength}
      height={pianoRollStore.canvasHeight}
      draw={drawPianoRollPitchCurve}
      resolution={pianoRollStore.resolution}
      {...other}
    />
  )
}

export default memo(PianoRollPitchCurve)