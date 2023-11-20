import { BasicFoe } from "./basicFoe.js";
import { Player } from "./player.js"
import { linkDamage } from "./effects/linkDamage.js";

// Initialize the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FPS Throttle
var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

// Gamemodes
const Gamemode = {
  menu: 0,
  game: 1
}

let currentGamemode = Gamemode.menu;

// Create the player object
const player = new Player((canvas.width / 2), (canvas.height / 2));

// Handle user input
const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

function HandleGameInputs() {
  if (keys["z"] && keys["s"]) {
    player.dy = 0;
  }
  else if (keys["z"]) {
    player.dy = -player.speed;
  }
  else if (keys["s"]) {
    player.dy = player.speed;
  }
  else {
    player.dy = 0;
  }

  if (keys["q"] && keys["d"]) {
    player.dx = 0;
  } else if (keys["q"]) {
    player.dx = -player.speed;
  } else if (keys["d"]) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }
}

// Create a basic foe
const foe = new BasicFoe((ctx.canvas.width / 2), 200, 2, 30, 30, 100, 200);

// Generate 10 random points
const foes = [];
for (let i = 0; i < 10; i++) {
  const newFoe = new BasicFoe(Math.random() * canvas.width, Math.random() * canvas.height, 2, 30, 30, 100, 200)
  foes.push(newFoe);
}

// Game loop
function gameLoop() {
  if (currentGamemode == Gamemode.menu) {
    requestAnimationFrame(gameLoop);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      then = now - (delta % interval);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.font = "24px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Appuyez sur entrée pour lancer le jeu", ctx.canvas.width/2, ctx.canvas.height/2);

      if (keys["Enter"]) {
        currentGamemode = Gamemode.game;
        console.log("changing gamemode to: " + currentGamemode);
      }
    }

  }
  else if (currentGamemode == Gamemode.game) {
    requestAnimationFrame(gameLoop);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      HandleGameInputs();

      linkDamage(ctx, foes, 20);

      foe.update(ctx, player);
      foe.render(ctx);

      player.update(ctx);
      player.render(ctx);

      for (let i = 0; i < foes.length; i++) {
        foes[i].update(ctx, player);
        foes[i].render(ctx);
      }
    }
  }
}

// Start the game loop
gameLoop();
