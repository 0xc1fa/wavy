import Canvas from "@/common/components/Canvas";
import useStore from "../../hooks/useStore";
import useTheme from "../../hooks/useTheme";
import { debug, isBlackKey } from "../../helpers";
import { memo } from "react";

interface PianoRollLanesBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {}
function PianoRollLanesBackground(props : PianoRollLanesBackgroundProps) {
  const { pianoRollStore } = useStore()
  const theme = useTheme();

  function useDrawPianoRollLanesBackground(ctx: CanvasRenderingContext2D) {

    const drawLane = (y: number, fillColor: string) => {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, y, pianoRollStore.canvasWidth, y + pianoRollStore.laneWidth)
    }
    const drawBlackLane = (y: number) => drawLane(y, theme.lane.blackLaneColor);
    const drawWhiteLane = (y: number) => drawLane(y, theme.lane.whiteLaneColor);
    const drawLaneUsingKeyNum = (keyNum: number) => {
      const y = pianoRollStore.getMaxYFromNoteNum(keyNum + 1);
      if (isBlackKey(keyNum)) drawBlackLane(y); else drawWhiteLane(y);
    }
    const drawAllLanes = () => {
      for (let keyNum = pianoRollStore.endingNoteNum - 1; keyNum >= pianoRollStore.startingNoteNum; keyNum--) {
        drawLaneUsingKeyNum(keyNum);
      }
    }

    debug(useDrawPianoRollLanesBackground.name);
    pianoRollStore.clearCanvas(ctx);
    drawAllLanes();
  }

  return (
    <Canvas
      style={props.style}
      width={pianoRollStore.laneLength}
      height={pianoRollStore.canvasHeight}
      draw={useDrawPianoRollLanesBackground}
      resolution={pianoRollStore.resolution}
    />
  )
}

export default memo(PianoRollLanesBackground)