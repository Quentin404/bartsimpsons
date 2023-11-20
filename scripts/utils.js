export function Angle(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

export function CustomText(ctx, text, size, font, color, align, x, y) {
  ctx.font = size + "px " + font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}