
// import { pianoKeyMouseHandler } from "../handlers/pianoKeysMouseHandlers";
// import { Component, useContext } from "solid-js";
// import { PianoRollState } from "../../store/pianoRollTheme";
import { debug, isBlackKey } from "../../helpers";
// import { GlobalAudioContext } from "@/contexts/GlobalAudioContext";
import Canvas from "@/common/components/Canvas";
import useStore from "../../hooks/useStore";
import useTheme from "../../hooks/useTheme";

interface PianoRollKeysProps extends React.HTMLAttributes<HTMLCanvasElement> {
  // state: PianoRollState,
}
export default function PianoRollKeys(props: PianoRollKeysProps) {

  const { pianoRollStore } = useStore();
  const theme = useTheme();


  function drawLabels(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    text: string
  ) {
    ctx.fillStyle = theme.key.keyLabelColor;
    ctx.font = `bold ${theme.key.keyLabelBaseSize * pianoRollStore.pianoLaneScaleY}px "Segoe UI", "Roboto", "San Francisco", sans-serif`;
    ctx.fillText(text, x, y);
  }



  function drawPianoRollKeys(
    ctx: CanvasRenderingContext2D,
  ) {

    const ctxConfig = () => {
      ctx.fillStyle = "#232323"
      ctx.fillRect(0, 0, pianoRollStore.keyLength, pianoRollStore.keyWidth * pianoRollStore.numOfKeys)
    }
    const isKeyPressed = (keyNum: number) => pianoRollStore.keyPressed.includes(keyNum)
    const isKeySelected = (keyNum: number) => pianoRollStore.keySelected.includes(keyNum)

    const isC = (keyNum: number) => keyNum % 12 === 0
    const getOctave = (keyNum: number) => Math.floor(keyNum / 12) - 1
    const getWhiteKeyColorCode = (keyNum: number) => {
      const isPressed = isKeyPressed(keyNum);
      const isSelected = isKeySelected(keyNum);
      return isSelected ? theme.key.keySelectedColor
        : (isPressed ? theme.key.whiteKeyPressedColor : theme.key.whiteKeyColor)
    }

    const getBlackKeyColorCode = (keyNum: number) => {
      const isPressed = isKeyPressed(keyNum);
      const isSelected = isKeySelected(keyNum);
      return isSelected ? theme.key.keySelectedColor
        : (isPressed ? theme.key.blackKeyPressedColor : theme.key.blackKeyColor)
    }

    const drawBlackKey = (keyNum: number) => {
      const keyColor = getBlackKeyColorCode(keyNum);
      const y = pianoRollStore.getMinYFromNoteNum(keyNum)
      drawKey(ctx, 0, y, pianoRollStore.keyWidth, pianoRollStore.blackKeyLength, theme.key.keyBorderRaduis, keyColor, keyColor);
    }

    const drawWhiteKeys = () => {
      const drawWhiteKey = (keyNum: number) => {
        let keyColor = getWhiteKeyColorCode(keyNum);
        drawKey(ctx, 0, currentY, pianoRollStore.whiteKeyWidth, pianoRollStore.keyLength, theme.key.keyBorderRaduis, keyColor, keyColor)
      }
      const drawCLabel = (keyNum: number) => drawLabels(ctx, pianoRollStore.keyLength - 22, currentY + pianoRollStore.whiteKeyWidth - 7, `C${getOctave(keyNum)}`)

      let currentY = 0
      for (let keyNum = pianoRollStore.numOfKeys - 1; keyNum >= pianoRollStore.startingNoteNum; keyNum--) {
        if (isBlackKey(keyNum)) continue;
        drawWhiteKey(keyNum);
        if (isC(keyNum)) drawCLabel(keyNum);
        currentY += pianoRollStore.whiteKeyWidth
      }
    }

    const drawBlackKeys = () => {
      for (let keyNum = pianoRollStore.numOfKeys - 1; keyNum >= pianoRollStore.startingNoteNum; keyNum--) {
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


  // const audioContext = useContext(GlobalAudioContext);
  // const mouseHandler = new pianoKeyMouseHandler(props.state, audioContext!)

  return (
    <Canvas aria-label="piano-roll-keys"
      style={props.style}
      width={pianoRollStore.keyLength}
      height={pianoRollStore.laneWidth * pianoRollStore.numOfKeys}
      draw={(ctx) => drawPianoRollKeys(ctx)}
      // draw={() => {}}
      resolution={pianoRollStore.resolution}
      // {...mouseHandler.onActions}
    />
  )
}

