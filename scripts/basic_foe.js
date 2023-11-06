// Define the player class
export class BasicFoe {
  constructor(x, y, speed, height, width) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;
  }

  update(ctx) {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0)
      this.x = 0;
    else if (this.x > ctx.canvas.width - this.width)
      this.x = ctx.canvas.width - this.width;
    if (this.y < 0)
      this.y = 0;
    else if (this.y > ctx.canvas.height - this.height)
      this.y = ctx.canvas.height - this.height;
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}