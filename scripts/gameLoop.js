import { Player } from "./player.js"
import { FoeGenerator } from "./foeGenerator.js";
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
const foesNumber = 6;
let foeGenerator;
let bestScore = 0;
let record = "";

function InitGame() {
  
  // Generate foes
  foeGenerator = new FoeGenerator(foesNumber);
  foeGenerator.initializePopulation(ctx);
  
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
        if (foeGenerator.playerScore > bestScore){
          bestScore = foeGenerator.playerScore;
          record = " - Nouveau record !"
        } else {
          record = "";
        }
        currentGamemode = Gamemode.dead;
        return;
      } else if (foeGenerator.foes.length < 1){
        currentGamemode = Gamemode.end;
        return;
      }

      // Display score
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.fillText("Score: " + foeGenerator.playerScore, 400, 30); // You can adjust the position as needed
      ctx.fillText("Best: " + bestScore, 400, 55); // You can adjust the position as needed

      HandleGameInputs();

      linkDamage(ctx, foeGenerator.foes, 20);

      player.update(ctx, foeGenerator.foes);
      player.render(ctx);

      foeGenerator.update(ctx, player);

      for (let i = 0; i < foeGenerator.foes.length; i++) {
        foeGenerator.foes[i].render(ctx);
      }

    } else if (currentGamemode === Gamemode.dead) {
      CustomText(ctx, "Vous êtes mort", 24, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2);
      CustomText(ctx, "Score : " + foeGenerator.playerScore + record, 16, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2 + 30);
      CustomText(ctx, "Appuyez sur entrée pour recommencer", 16, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2 + 60);

      if (keys["Enter"]) {
        foeGenerator.playerScore = 0;
        currentGamemode = Gamemode.game;
        InitGame();
        console.log("changing gamemode to: " + currentGamemode);
      }
    } else if (currentGamemode === Gamemode.end) {
      CustomText(ctx, "Victoire !", 24, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2);
      CustomText(ctx, "Appuyez sur entrée pour recommencer", 16, "Arial", "white", "center", ctx.canvas.width/2, ctx.canvas.height/2 + 30);

      if (keys["Enter"]) {
        foeGenerator.playerScore = 0;
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
