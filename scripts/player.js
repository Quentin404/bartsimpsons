export class Player {
  constructor(x, y) {
    // Basics
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.dx = 0;
    this.dy = 0;
    this.height = 20;
    this.width = 20;
    // Stats
    this.health = 1000;
  }

  update(ctx) {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 + this.width/2)
      this.x = 0 + this.width/2;
    else if (this.x > ctx.canvas.width - this.width/2)
      this.x = ctx.canvas.width - this.width/2;
    if (this.y < 0 + this.height/2)
      this.y = 0 + this.height/2;
    else if (this.y > ctx.canvas.height - this.height/2)
      this.y = ctx.canvas.height - this.height/2;
  }

  render(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x - (this.width/2), this.y - (this.width/2), this.width, this.height);
  }
}