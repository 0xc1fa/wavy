import { useEffect, useRef } from "react";

export interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  draw: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
  resolution: number;
}
const Canvas: React.FC<CanvasProps> = (props) =>{
  const {draw, style, ...rest} = props;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx === null || ctx === undefined) {
      throw new Error("Fail to get canvas context");
    } else {
      // canvasRef()!.width = props.width;
      // canvasRef()!.height = props.height;
      canvasRef.current!.width = props.width * devicePixelRatio * props.resolution;
      canvasRef.current!.height = props.height * devicePixelRatio * props.resolution;
      ctx.scale(devicePixelRatio * props.resolution, devicePixelRatio * props.resolution);
      ctx.save();
      props.draw(ctx)
    }
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx === null || ctx === undefined) {
      throw new Error("Fail to get context");
    } else {
      props.draw(ctx)
    }
  }, [props.draw, canvasRef])

  return (
    <canvas
      {...rest}
      width={props.width * devicePixelRatio * props.resolution}
      height={props.height * devicePixelRatio * props.resolution}
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        ...props.style
      }}
      ref={canvasRef}
    />
  )
}

export default Canvas;