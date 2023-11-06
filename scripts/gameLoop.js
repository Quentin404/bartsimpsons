import { BasicFoe } from "./basic_foe.js";
import { Player } from "./player.js"
import { linkDamage } from "./effects/linkDamage.js";

// Initialize the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Create the player object
const player = new Player((canvas.width/2)-10, (canvas.height/2)-10);

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
const foe = new BasicFoe((ctx.canvas.width/2)-15, 185, 2, 30, 30);

// Generate 10 random points
const points = [];
for (let i = 0; i < 10; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  points.push({ x, y });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  HandleInputs();

  linkDamage(ctx, points);

  foe.update(ctx);
  foe.render(ctx);

  player.update(ctx);
  player.render(ctx);

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
