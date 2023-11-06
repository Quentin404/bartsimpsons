// Define the player class
export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.dx = 0;
    this.dy = 0;
    this.height = 20;
    this.width = 20;
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
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}