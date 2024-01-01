
// import { pianoKeyMouseHandler } from "../handlers/pianoKeysMouseHandlers";
// import { Component, useContext } from "solid-js";
import { PianoRollState } from "../../store/pianoRollTheme";
import { debug, isBlackKey } from "../../helpers";
// import { GlobalAudioContext } from "@/contexts/GlobalAudioContext";
import Canvas from "@/common/components/Canvas";

interface PianoRollKeysProps extends React.HTMLAttributes<HTMLCanvasElement> {
  state: PianoRollState,
}
export default function PianoRollKeys(props: PianoRollKeysProps) {


  // const audioContext = useContext(GlobalAudioContext);
  const mouseHandler = new pianoKeyMouseHandler(props.state, audioContext!)

  return (
    <Canvas aria-label="piano-roll-keys"
      style={props.style}
      width={props.state.keyLength}
      height={props.state.laneWidth * props.state.numOfKeys}
      draw={(ctx) => drawPianoRollKeys(ctx, props.state)}
      resolution={props.state.resolution}
      {...mouseHandler.onActions}
    />
  )
}

function drawPianoRollKeys(
  ctx: CanvasRenderingContext2D,
  state: PianoRollState,
) {
  const ctxConfig = () => {
    ctx.fillStyle = "#232323"
    ctx.fillRect(0, 0, state.keyLength, state.keyWidth * state.numOfKeys)
  }
  const isKeyPressed = (keyNum: number) => state.keyPressed.includes(keyNum)
  const isKeySelected = (keyNum: number) => state.keySelected.includes(keyNum)

  const isC = (keyNum: number) => keyNum % 12 === 0
  const getOctave = (keyNum: number) => Math.floor(keyNum / 12) - 1
  const getWhiteKeyColorCode = (keyNum: number) => {
    const isPressed = isKeyPressed(keyNum);
    const isSelected = isKeySelected(keyNum);
    return isSelected ? state.keySelectedColor
      : (isPressed ? state.whiteKeyPressedColor : state.whiteKeyColor)
  }

  const getBlackKeyColorCode = (keyNum: number) => {
    const isPressed = isKeyPressed(keyNum);
    const isSelected = isKeySelected(keyNum);
    return isSelected ? state.keySelectedColor
      : (isPressed ? state.blackKeyPressedColor : state.blackKeyColor)
  }

  const drawBlackKey = (keyNum: number) => {
    const keyColor = getBlackKeyColorCode(keyNum);
    const y = state.getMinYFromNoteNum(keyNum)
    drawKey(ctx, 0, y, state.keyWidth, state.blackKeyLength, state.keyBorderRaduis, keyColor, keyColor);
  }

  const drawWhiteKeys = () => {
    const drawWhiteKey = (keyNum: number) => {
      let keyColor = getWhiteKeyColorCode(keyNum);
      drawKey(ctx, 0, currentY, state.whiteKeyWidth, state.keyLength, state.keyBorderRaduis, keyColor, keyColor)
    }
    const drawCLabel = (keyNum: number) => drawLabels(ctx, state.keyLength - 22, currentY + state.whiteKeyWidth - 7, `C${getOctave(keyNum)}`, state)

    let currentY = 0
    for (let keyNum = state.endingNoteNum - 1; keyNum >= state.startingNoteNum; keyNum--) {
      if (isBlackKey(keyNum)) continue;
      drawWhiteKey(keyNum);
      if (isC(keyNum)) drawCLabel(keyNum);
      currentY += state.whiteKeyWidth
    }
  }

  const drawBlackKeys = () => {
    for (let keyNum = state.endingNoteNum - 1; keyNum >= state.startingNoteNum; keyNum--) {
      if (isBlackKey(keyNum)) drawBlackKey(keyNum);
    }
  }

  debug(drawPianoRollKeys.name);
  ctxConfig();
  drawWhiteKeys();
  drawBlackKeys();
}

function drawKey(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  keyWidth: number, keyLength: number,
  borderRadius: number,
  fillColor: string, borderColor: string,
) {
  const ctxConfig = () => {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
  }
  const getBorderPosition = () => {
    const offsetX = 0.5;
    const offsetY = 1;
    const left = x;
    const top = y + offsetY;
    const right = x + keyLength - offsetX;
    const bottom = y + keyWidth - offsetY;
    return { left, right, top, bottom }
  }
  const draw = () => {
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(right - borderRadius, top)
    ctx.arcTo(right, top, right, top + borderRadius, borderRadius)
    ctx.lineTo(right, bottom - borderRadius)
    ctx.arcTo(right, bottom, right - borderRadius, bottom, borderRadius)
    ctx.lineTo(x, bottom)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  ctxConfig();
  const { left, right, top, bottom } = getBorderPosition();
  draw();
}

function drawLabels(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  text: string,
  state: PianoRollState,
) {
  ctx.fillStyle = state.keyLabelColor;
  ctx.font = `bold ${state.keyLabelBaseSize*state.pianoLaneScaleY}px "Segoe UI", "Roboto", "San Francisco", sans-serif`;
  ctx.fillText(text, x, y);
}
