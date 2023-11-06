import { BasicFoe } from "./basicFoe.js";
import { Player } from "./player.js"
import { linkDamage } from "./effects/linkDamage.js";

// Initialize the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Create the player object
const player = new Player((canvas.width/2), (canvas.height/2));

// Handle user input
const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

function HandleInputs() {
  if (keys["ArrowUp"] && keys["ArrowDown"]) {
    player.dy = 0;
  }
  else if (keys["ArrowUp"]) {
    player.dy = -player.speed;
  } 
  else if (keys["ArrowDown"]) {
    player.dy = player.speed;
  } 
  else {
    player.dy = 0;
  }
   
  if (keys["ArrowLeft"] && keys["ArrowRight"]) {
    player.dx = 0;
  }else if (keys["ArrowLeft"]) {
    player.dx = -player.speed;
  } else if (keys["ArrowRight"]) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }
}

// Create a basic foe
const foe = new BasicFoe((ctx.canvas.width/2), 200, 2, 30, 30, 100, 200);

// Generate 10 random points
const foes = [];
for (let i = 0; i < 10; i++) {
  const newFoe = new BasicFoe(Math.random() * canvas.width, Math.random() * canvas.height, 2, 30, 30)
  foes.push(newFoe);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  HandleInputs();

  linkDamage(ctx, foes, 20);

  foe.update(ctx, player);
  foe.render(ctx);

  for (let i = 0; i < foes.length; i++){
    foes[i].update(ctx);
    foes[i].render(ctx);
  }

  player.update(ctx);
  player.render(ctx);

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
