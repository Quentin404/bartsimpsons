// renderEngine.js

export class RenderEngine {
  constructor() {
    this.ctx = null;
  }

  setContext(ctx) {
    this.ctx = ctx;
  }

  clearCanvas(width, height) {
    this.ctx.clearRect(0, 0, width, height);
  }

  render(player, projectiles) {
    this.clearCanvas(this.ctx.canvas.width, this.ctx.canvas.height);

    // Render player
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(player.x, player.y, 20, 20);

    // Render projectiles
    // this.ctx.fillStyle = "red";
    // projectiles.forEach((projectile) => {
    //   if (projectile.active) {
    //     this.ctx.fillRect(projectile.x, projectile.y, 5, 5);
    //   }
    // });
  }
}