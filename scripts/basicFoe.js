import { Projectile } from "./projectile.js";
import { Angle } from "./utils.js";

export class BasicFoe {
  constructor(x, y, speed, height, width, fireRate, moveRate) {
    // Basics
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;
    
    // Firing
    this.fireRate = fireRate;
    this.projectiles = [];
    this.lastFireTime = 0;
    this.firingAngle = 90;

    // Movements
    this.moveRate = moveRate;
    this.lastMoveTime = 0;
  }

  update(ctx, player) {
    const currentTime = performance.now();

    // Movements
    if (currentTime - this.lastMoveTime >= this.moveRate) {
      this.randomMove();
      this.lastMoveTime = currentTime;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Handle canvas limits
    if (this.x < 0 + this.width/2)
      this.x = 0 + this.width/2;
    else if (this.x > ctx.canvas.width - this.width/2)
      this.x = ctx.canvas.width - this.width/2;
    if (this.y < 0 + this.height/2)
      this.y = 0 + this.height/2;
    else if (this.y > ctx.canvas.height - this.height/2)
      this.y = ctx.canvas.height - this.height/2;

    // Fire projectiles
    if (currentTime - this.lastFireTime >= this.fireRate) {
      this.fireProjectile(Angle(this.firingAngle));
      this.firingAngle += 15;
      this.lastFireTime = currentTime;
    }

    // Update and render projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(ctx);
      if (!projectile.active || projectileHitsPlayer(player, projectile)) {
        this.projectiles.splice(i, 1);
        player.hit(projectile.damage);
        console.log("it doesn't work HERE");
      }
    }
  }

  fireProjectile(angle) {
    const projectile = new Projectile(this.x, this.y, 5, angle, 5, 5);
    this.projectiles.push(projectile);
  }

  randomMove() {
    this.dx = (Math.random() - .5) * this.speed * 2;
    this.dy = (Math.random() - .5) * this.speed * 2;
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    // Render projectiles
    this.projectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
  }
}

function projectileHitsPlayer(player, projectile) {
  // Implement collision detection logic between the player and the projectile here
  // Return true if there is a collision, false otherwise
  // You may check if the projectile's position is within the player's bounds
  return (
    projectile.x >= player.x - player.width / 2 &&
    projectile.x <= player.x + player.width / 2 &&
    projectile.y >= player.y - player.height / 2 &&
    projectile.y <= player.y + player.height / 2
  );
}