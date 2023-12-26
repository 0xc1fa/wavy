import Canvas from "@/common/components/Canvas";
import useTheme from "../../hooks/useTheme";
import { debug, isBlackKey } from "../../helpers";
import { memo } from "react";
import { usePianoRollTransform } from "../../hooks/usePianoRollTransform";
import useStore from "../../hooks/useStore";

interface PianoRollLanesBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {}
function PianoRollLanesBackground(props : PianoRollLanesBackgroundProps) {

  const { pianoRollStore } = useStore();

  const transform = usePianoRollTransform()
  const theme = useTheme();

  function useDrawPianoRollLanesBackground(ctx: CanvasRenderingContext2D) {

    const drawLane = (y: number, fillColor: string) => {
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, y, transform.laneLength, y + transform.laneWidth)
    }
    const drawBlackLane = (y: number) => drawLane(y, theme.lane.blackLaneColor);
    const drawWhiteLane = (y: number) => drawLane(y, theme.lane.whiteLaneColor);
    const drawLaneUsingKeyNum = (keyNum: number) => {
      const y = pianoRollStore.getMaxYFromNoteNum(keyNum + 1);
      if (isBlackKey(keyNum)) drawBlackLane(y); else drawWhiteLane(y);
    }
    const drawAllLanes = () => {
      for (let keyNum = transform.endingNoteNum - 1; keyNum >= transform.startingNoteNum; keyNum--) {
        drawLaneUsingKeyNum(keyNum);
      }
    }

    debug(useDrawPianoRollLanesBackground.name);
    pianoRollStore.clearCanvas(ctx);
    drawAllLanes();
  }

  return (
    <Canvas aria-label="piano-roll-lanes-background"
      style={props.style}
      width={transform.laneLength}
      height={transform.canvasHeight}
      draw={useDrawPianoRollLanesBackground}
      resolution={transform.resolution}
    />
  )
}

export default memo(PianoRollLanesBackground)