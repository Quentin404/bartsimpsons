export class Projectile {
  constructor(x, y, speed, direction, height, width) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dir = direction;
    this.dx = speed * Math.cos(direction);
    this.dy = speed * Math.sin(direction);
    this.height = height;
    this.width = width;
    this.active = true;
  }

  update(ctx) {
    if (this.active) {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x < 0 || this.x > ctx.canvas.width - this.width || this.y < 0 || this.y > ctx.canvas.height - this.height)
        this.active = false;
    }
  }

  render(ctx) {
    if (this.active) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x - (this.width/2), this.y - (this.width/2), this.width, this.height);
    }
  }
}