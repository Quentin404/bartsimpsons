import { BasicFoe } from "./basicFoe.js";
import { Player } from "./player.js"
import { linkDamage } from "./effects/linkDamage.js";
import { CustomText } from "./utils.js";

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
  game: 1,
  dead: 2,
  end: 3
}

let currentGamemode = Gamemode.menu;

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

let player;
let foe;
let foes;

function InitGame() {
  // Create a basic foe
  foe = new BasicFoe((ctx.canvas.width / 2), 200, 2, 30, 30, 100, 200);
  
  // Generate 10 random points
  foes = [];
  for (let i = 0; i < 10; i++) {
    const newFoe = new BasicFoe(Math.random() * canvas.width, Math.random() * canvas.height, 2, 30, 30, 100, 200)
    foes.push(newFoe);
  }
  
  // Create the player object
  player = new Player((canvas.width / 2), (canvas.height / 2));
}

// Game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);
  now = Date.now();
  delta = now - then;
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (delta > interval) {
    then = now - (delta % interval);

    if (currentGamemode === Gamemode.menu) {
      CustomText(ctx, "Appuyez sur entrée pour lancer le jeu", 24, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2)

      if (keys["Enter"]) {
        currentGamemode = Gamemode.game;
        console.log("changing gamemode to: " + currentGamemode);
      }
      
    }
    else if (currentGamemode === Gamemode.game) {
      if (player.isDead()) {
        currentGamemode = Gamemode.dead;
        return;
      } else if (foes.length < 1){
        currentGamemode = Gamemode.end;
        return;
      }

      HandleGameInputs();

      linkDamage(ctx, foes, 20);

      player.update(ctx, foes);
      player.render(ctx);

      for (let i = 0; i < foes.length; i++) {
        foes[i].update(ctx, player);
        foes[i].render(ctx);
      }
    } else if (currentGamemode === Gamemode.dead) {
      CustomText(ctx, "Vous êtes mort", 24, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2);
      CustomText(ctx, "Appuyez sur entrée pour recommencer", 16, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2 + 30);

      if (keys["Enter"]) {
        currentGamemode = Gamemode.game;
        InitGame();
        console.log("changing gamemode to: " + currentGamemode);
      }
    } else if (currentGamemode === Gamemode.end) {
      CustomText(ctx, "Victoire !", 24, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2);
      CustomText(ctx, "Appuyez sur entrée pour recommencer", 16, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2 + 30);

      if (keys["Enter"]) {
        currentGamemode = Gamemode.game;
        InitGame();
        console.log("changing gamemode to: " + currentGamemode);
      }
    }
  }
}


InitGame();
// Start the game loop
gameLoop();
