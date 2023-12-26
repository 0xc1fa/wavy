import Canvas from "@/common/components/Canvas";
import { debug } from "../../helpers";
import { PianoRollLanesMouseHandlerMode, PianoRollMouseHandlersStates } from "../../hooks/usePianoRollMouseHandler";
import useTheme from "../../hooks/useTheme";
import useStore from "../../hooks/useStore";
import { memo, useMemo } from "react";

interface PianoRollSelectionAreaProps extends React.HTMLAttributes<HTMLCanvasElement> {
  mouseHandlersStates: PianoRollMouseHandlersStates
}
function PianoRollSelectionArea({ mouseHandlersStates, style, ...other }: PianoRollSelectionAreaProps) {

  const { pianoRollStore } = useStore();
  const theme = useTheme();

  function drawPianoRollSelectionArea(ctx: CanvasRenderingContext2D){

    if (mouseHandlersStates.mouseHandlerMode !== PianoRollLanesMouseHandlerMode.MarqueeSelection) {
      return;
    }

    const fillStyle = theme.selection.selectionAreaFillColor;
    const strokeStyle = theme.selection.selectionAreaBorderColor;

    const startingPositionX = mouseHandlersStates.startingPosition.x;
    const startingPositionY = mouseHandlersStates.startingPosition.y;
    const ongoingPositionX = mouseHandlersStates.ongoingPosition.x;
    const ongoingPositionY = mouseHandlersStates.ongoingPosition.y;

    const configCtx = () => {
      ctx.lineWidth = 5;
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
    }
    
    const calculateBorderPositions = () => {
      const left = Math.min(startingPositionX, ongoingPositionX);
      const right = Math.max(startingPositionX, ongoingPositionX);
      const top = Math.min(startingPositionY, ongoingPositionY);
      const bottom = Math.max(startingPositionY, ongoingPositionY);
      return { left, right, top, bottom }
    }

    const calculateDimensions = () => {
      const width = right - left;
      const height = bottom - top;
      return { width , height };
    }
    const drawSelectionArea = () => { ctx.fillRect(left, top, width, height) }

    debug(drawPianoRollSelectionArea.name);
    pianoRollStore.clearCanvas(ctx);

    configCtx();
    const { left, right, top, bottom } = calculateBorderPositions();
    const { width, height } = calculateDimensions();
    drawSelectionArea();

  }

  return (
    <Canvas aria-label="piano-roll-selection-area"
      style={style}
      width={pianoRollStore.laneLength}
      height={pianoRollStore.canvasHeight}
      draw={drawPianoRollSelectionArea}
      resolution={pianoRollStore.resolution}
      {...other}
    />
  )
}

export default memo(PianoRollSelectionArea)
