import { Projectile } from "./projectile.js";
import { linkDamage } from "./effects/linkDamage.js";
import {Angle} from "./utils.js";

var volume = .2;
var playerFireProjectileSounds = [
  new Audio("../audio/playerFireProjectile1.mp3"),
  new Audio("../audio/playerFireProjectile2.mp3"),
  new Audio("../audio/playerFireProjectile3.mp3")
];
playerFireProjectileSounds.forEach(e => { e.volume = volume; });
var playerHitSounds = [
  new Audio("../audio/playerHit1.mp3"),
  new Audio("../audio/playerHit2.mp3"),
  new Audio("../audio/playerHit3.mp3")
];
playerHitSounds.forEach(e => { e.volume = volume });

const superShotSound = new Audio("../audio/superShot.mp3");
superShotSound.volume = .5;
const superHitSound = new Audio("../audio/superHit.mp3");
superHitSound.volume = .5;
const superAvailableSound = new Audio("../audio/superAvailable.mp3");
superAvailableSound.volume = .5;
let superAvailableSoundPlayed = false;
const superHitDelay = 60;
let superHitDelayTimer = superHitDelay;
let superHitting = false;

export class Player {
  constructor(x, y) {
    // Basics
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.dx = 0;
    this.dy = 0;
    this.height = 40;
    this.width = 40;
    this.playerImage = new Image();
    this.loadPlayerImage();

    // Stats
    this.health = 4000;

    // Firing
    this.fireRate = 50;
    this.projectiles = [];
    this.lastFireTime = 0;
    this.firingAngle = Math.PI * 1.5; // Initial firing angle (up)
    this.projectileDamage = 50;
    // Super Fire
    this.superDelay = 300;
    this.superDelayTimer = this.superDelay;
  }

  update(ctx, foes, keys) {
    const currentTime = performance.now();

    this.x += this.dx;
    this.y += this.dy;

    if (this.x < this.width / 2)
      this.x = this.width / 2;
    else if (this.x > ctx.canvas.width - this.width / 2)
      this.x = ctx.canvas.width - this.width / 2;
    if (this.y < this.height / 2)
      this.y = this.height / 2;
    else if (this.y > ctx.canvas.height - this.height / 2)
      this.y = ctx.canvas.height - this.height / 2;

    // Determine the firing angle based on arrow keys

    if (keys["ArrowUp"]) {
      if (keys["ArrowLeft"]) {
        this.firingAngle = Math.PI * 1.25; // Up-Left
      } else if (keys["ArrowRight"]) {
        this.firingAngle = Math.PI * 1.75; // Up-Right
      } else {
        this.firingAngle = Math.PI * 1.5; // Up
      }
    } else if (keys["ArrowDown"]) {
      if (keys["ArrowLeft"]) {
        this.firingAngle = Math.PI * 0.75; // Down-Left
      } else if (keys["ArrowRight"]) {
        this.firingAngle = Math.PI * 0.25; // Down-Right
      } else {
        this.firingAngle = Math.PI * 0.5; // Down
      }
    } else if (keys["ArrowLeft"]) {
      this.firingAngle = Math.PI; // Left
    } else if (keys["ArrowRight"]) {
      this.firingAngle = 0; // Right
    }

    // Super Fire
    if (this.superDelayTimer !== 0) {
      this.superDelayTimer--;
    } else {
      //console.log("You can super now!!")
      if (!superAvailableSoundPlayed) {
        superAvailableSound.play();
        superAvailableSoundPlayed = true;
      }
      if (keys["f"]) {
        this.superDelayTimer = this.superDelay;
        this.fireProjectile(true);
        superShotSound.play();
        superAvailableSoundPlayed = false;
        //console.log("SUPER FIRE");
      }
    }
    // Super Hit
    if (superHitting) {
      var max = -1 + (superHitDelayTimer / 60) * (20 - 1);
      linkDamage(ctx, foes, max);
      if (superHitDelayTimer !== 0) {
        superHitDelayTimer--;
      }
      else {
        superHitting = false;
        superHitDelayTimer = superHitDelay;
        for (let i = 0; i < foes.length; i++) {
          foes[i].hit(500);
        }
        superShotSound.play();
      }
    }

    // Fire projectiles
    if (currentTime - this.lastFireTime >= this.fireRate) {
      this.fireProjectile(false);
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
          if (projectile.superFire) {
            superHitting = true;
            superHitSound.play();
          }

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
    if (superAvailableSoundPlayed) {
      ctx.textAlign = "center";
      ctx.font = '28px Bourgeois Bold Condensed';
      ctx.fillText("[F] Superfire", ctx.canvas.width / 2, ctx.canvas.height - 80);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.firingAngle + Angle(90));
    ctx.drawImage(this.playerImage, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();

    // Render projectiles
    this.projectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
  }

  fireProjectile(superFire) {
    var speed = superFire ? 20 : 10;
    var size = superFire ? 20 : 8;

    const playerProjectile = new Projectile(this.x, this.y, speed, this.firingAngle, size, size, this.projectileDamage, "foe", superFire);
    this.projectiles.push(playerProjectile);
  }

  hit(damage) {
    var randomSound = Math.floor(Math.random() * 2);
    playerHitSounds[randomSound].currentTime = 0;
    playerHitSounds[randomSound].play();

    this.health -= damage;
  }

  isDead() {
    return this.health <= 0;
  }

  loadPlayerImage() {
    this.playerImage.src = "../images/sprites/sprite-player.png";
  }

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