export class Projectile {
  constructor(x, y, speed, direction, height, width, damage, target, superFire) {
    // Basics
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dir = direction;
    this.dx = speed * Math.cos(direction);
    this.dy = speed * Math.sin(direction);
    this.height = height;
    this.width = width;
    this.active = true;
    this.target = target;
    this.superFire = superFire;
    this.superFireImage = new Image();
    this.loadSuperFireImage();

    // Stats
    this.damage = damage;
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
      if (this.superFire){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.superFireImage, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      } else {
        if (this.target === "player") {
          ctx.fillStyle = "gold"
          ctx.strokeStyle = "white";
        } else {
          ctx.fillStyle = "white";
          ctx.strokeStyle = "blue";
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2); // Draw a circle
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  loadSuperFireImage() {
    this.superFireImage.src = "../images/sprites/sprite-superfire-projectile.png";
  }
}