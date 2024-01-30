import {Projectile} from "./projectile.js";

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

    // Firing
    this.fireRate = 50;
    this.projectiles = [];
    this.lastFireTime = 0;
    this.firingAngle = 4.71239;
    this.projectileDamage = 50;
  }

  update(ctx, foes) {
    const currentTime = performance.now();

    this.x += this.dx;
    this.y += this.dy;

    if (this.x < this.width / 2)
      this.x = this.width / 2;
    else if (this.x > ctx.canvas.width - this.width/2)
      this.x = ctx.canvas.width - this.width/2;
    if (this.y < this.height / 2)
      this.y = this.height / 2;
    else if (this.y > ctx.canvas.height - this.height/2)
      this.y = ctx.canvas.height - this.height/2;

    // Fire projectiles

    if (currentTime - this.lastFireTime >= this.fireRate) {
      this.fireProjectile();
      this.lastFireTime = currentTime;
    }

    // Update and render projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(ctx);

      // Check for collision with foes
      for (let j = 0; j < foes.length; j++) {
        const foe = foes[j];
        if (projectileHitsFoe(foe, projectile)) {
          // Apply damage to the foe
          foe.hit(projectile.damage);

          // Remove the projectile
          this.projectiles.splice(i, 1);

          break;
        } else if (!projectile.active) {
          this.projectiles.splice(i, 1);
        }
      }
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
    }
  }

  render(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x - (this.width/2), this.y - (this.width/2), this.width, this.height);
    displayHealth(ctx, this.health);

    // Render projectiles
    this.projectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
  }

  fireProjectile() {
    const playerProjectile = new Projectile(this.x, this.y, 5, this.firingAngle, 5, 5, this.projectileDamage, "foe"); // Customize the projectile parameters as needed
    this.projectiles.push(playerProjectile);
  }

  hit(damage) {
    this.health -= damage;
  }

  isDead() {
    return this.health <= 0;
  }
}

function displayHealth(ctx, health) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("Health: " + health, 10, 30); // You can adjust the position as needed
}

function projectileHitsFoe(foe, projectile) {
  // Implement collision detection logic between the player and the projectile here
  // Return true if there is a collision, false otherwise
  // You may check if the projectile's position is within the player's bounds
  return (
      projectile.x >= foe.x - foe.width / 2 &&
      projectile.x <= foe.x + foe.width / 2 &&
      projectile.y >= foe.y - foe.height / 2 &&
      projectile.y <= foe.y + foe.height / 2
  );
}