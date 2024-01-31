import { Projectile } from "./projectile.js";
import { Angle } from "./utils.js";

var volume = .2;
var foeFireProjectileSounds = [
  new Audio("../audio/playerFireProjectile1.mp3"),
  new Audio("../audio/playerFireProjectile2.mp3"),
  new Audio("../audio/playerFireProjectile3.mp3"),
  new Audio("../audio/foeFireProjectile1.mp3"),
  new Audio("../audio/foeFireProjectile2.mp3"),
  new Audio("../audio/foeFireProjectile3.mp3")
];
foeFireProjectileSounds.forEach(e => { e.volume = volume; });

var foeHitSounds = [
  new Audio("../audio/foeHit1.mp3"),
  new Audio("../audio/foeHit2.mp3"),
  new Audio("../audio/foeHit3.mp3")
];
foeHitSounds.forEach(e => { e.volume = volume });

export class BasicFoe {
  constructor(x, y, speed, height, width, shootingPattern, accuracy, fireRate, moveRate) {
    // Basics
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dx = 0;
    this.dy = 0;
    this.height = height;
    this.width = width;
    this.foeImage = new Image();
    this.loadFoeImage();

    // Firing
    this.firingPatterns = {
      spiral: 0,
      target: 1,
      badShooter: 2
    }
    this.currentFiringPattern = shootingPattern;
    this.fireRate = fireRate;
    this.accuracy = accuracy; // Between 1 and 100, 100 being the most accurate
    this.projectiles = [];
    this.lastFireTime = 0;
    this.firingAngle = 90;
    this.projectileDamage = 50;

    // Stats
    this.health = 100;
    this.hitsToPlayer = 0;
    this.survivalTime = 0;
    this.performance = 0;

    // Movements
    this.moveRate = moveRate;
    this.lastMoveTime = 0;
  }

  update(ctx, player) {
    const currentTime = performance.now();
    this.survivalTime += 1;

    // Movements
    if (currentTime - this.lastMoveTime >= this.moveRate) {
      this.randomMove();
      this.lastMoveTime = currentTime;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Handle canvas limits
    if (this.x < this.width / 2)
      this.x = this.width / 2;
    else if (this.x > ctx.canvas.width - this.width / 2)
      this.x = ctx.canvas.width - this.width / 2;
    if (this.y < this.height / 2)
      this.y = this.height / 2;
    else if (this.y > ctx.canvas.height - this.height / 2)
      this.y = ctx.canvas.height - this.height / 2;

    // Fire projectiles
    if (currentTime - this.lastFireTime >= this.fireRate) {
      if (this.currentFiringPattern === this.firingPatterns.spiral) {
        this.spiralShootingPattern();
      } else if (this.currentFiringPattern === this.firingPatterns.target) {
        this.playerTargetShootingPattern(player)
      } else if (this.currentFiringPattern === this.firingPatterns.badShooter) {
        this.badShooterShootingPattern(player)
      }
      this.lastFireTime = currentTime;

      var randomSound = Math.floor(Math.random() * 2);
      foeFireProjectileSounds[randomSound].currentTime = 0;
      foeFireProjectileSounds[randomSound].play();
    }

    // Update and render projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(ctx);

      if (projectileHitsPlayer(player, projectile)) {
        this.hitsToPlayer += 1;
        player.hit(projectile.damage);

        this.projectiles.splice(i, 1);
      } else if (!projectile.active) {
        this.projectiles.splice(i, 1);
      }
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
    }
  }

  fireProjectile(angle) {
    const projectile = new Projectile(this.x, this.y, 3, angle, 5, 5, this.projectileDamage, "player");
    this.projectiles.push(projectile);
  }

  randomMove() {
    this.dx = (Math.random() - .5) * this.speed * 2;
    this.dy = (Math.random() - .5) * this.speed * 2;
  }

  render(ctx) {
    if (this.currentFiringPattern === 0){
      ctx.fillStyle = "red";
    } else if (this.currentFiringPattern === 1) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Angle(90));
    ctx.drawImage(this.foeImage, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();

    // Render projectiles
    this.projectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
  }

  hit(damage) {
    var randomSound = Math.floor(Math.random() * 2);
    foeHitSounds[randomSound].currentTime = 0;
    foeHitSounds[randomSound].play();

    this.health -= damage;
  }

  isDead() {
    return this.health < 0;
  }

  // Fires in a spiral
  spiralShootingPattern() {
    this.firingAngle += 15;
    this.fireProjectile(Angle(this.firingAngle));
  }

  // Fires in the direction of the player
  playerTargetShootingPattern(player) {
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);

    const accuracyFactor = (100 - this.accuracy) / 100;

    const correctedAngle = angleToPlayer + (Math.random() - 0.5) * Math.PI * accuracyFactor;

    this.fireProjectile(correctedAngle);
  }

  // Fires in the opposite direction of the player
  badShooterShootingPattern(player) {
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);

    const accuracyFactor = (100 - this.accuracy) / 100 * 5;

    const correctedAngle = angleToPlayer + Math.PI + (Math.random() - 0.5) * Math.PI * accuracyFactor;

    this.fireProjectile(correctedAngle);
  }

  loadFoeImage() {
    this.foeImage.src = "../images/sprites/sprite-foe.png";
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

