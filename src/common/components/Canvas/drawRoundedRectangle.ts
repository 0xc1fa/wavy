
export function drawRoundedRectangle(
  ctx: CanvasRenderingContext2D,
  top: number, left: number,
  width: number, height: number,
  borderRadius: number,
  drawBorder: boolean = true,
) {
  let x = left;
  let y = top;
  ctx.beginPath();
  ctx.moveTo(x + borderRadius, y);
  ctx.lineTo(x + width - borderRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
  ctx.lineTo(x + width, y + height - borderRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
  ctx.lineTo(x + borderRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
  ctx.lineTo(x, y + borderRadius);
  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
  ctx.closePath();
  ctx.fill();
  if (drawBorder) {
    ctx.stroke();
  }
}
