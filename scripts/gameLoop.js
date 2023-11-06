import { Player } from "./player.js"

// Initialize the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Create the player object
const player = new Player(canvas.width / 2, canvas.height / 2);

// Handle user input
const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update the player's movement
  if (keys["ArrowUp"]) {
    player.dy = -player.speed;
  } else if (keys["ArrowDown"]) {
    player.dy = player.speed;
  } else {
    player.dy = 0;
  }

  if (keys["ArrowLeft"]) {
    player.dx = -player.speed;
  } else if (keys["ArrowRight"]) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }

  // Update and render the player
  player.update();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
