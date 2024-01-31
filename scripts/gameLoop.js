import { Player } from "./player.js"
import { FoeGenerator } from "./foeGenerator.js";
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

var playerDeadSound = new Audio("../audio/playerDead.mp3");
playerDeadSound.volume = .2;

var musicDeadVolume = .2;
var musicDead = new Audio("../audio/music_dead.wav");
musicDead.volume = musicDeadVolume;
musicDead.loop = true;

var musicVolume = .3;
var music = new Audio("../audio/music_full.wav");
music.volume = 0;
music.loop = true;

function SwitchMusic(dead) {
  music.volume = dead ? 0 : musicVolume;
  musicDead.volume = dead ? musicDeadVolume : 0;
}

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
const foesNumber = 5;
let foeGenerator;
let bestScore = 0;
let record = "";

let bigTextSize = 36;
let mediumTextSize = 26;

const backgroundImage = new Image();
backgroundImage.src = "../images/bg.png";

function InitGame() {
  // Play music
  music.play();
  musicDead.play();

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

  if (delta > interval) {
    then = now - (delta % interval);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    if (currentGamemode === Gamemode.menu) {
      CustomText(ctx, "Press Enter to play", bigTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2)
      CustomText(ctx, "[ZQSD] - Move", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, (ctx.canvas.height / 2) + 40)
      CustomText(ctx, "[Arrows] - Aim", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, (ctx.canvas.height / 2) + 70)
      CustomText(ctx, "[F] - Superfire", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, (ctx.canvas.height / 2) + 100)
      CustomText(ctx, "[M] - Toggle music", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, (ctx.canvas.height / 2) + 130)

      if (keys["Enter"]) {
        currentGamemode = Gamemode.game;
        console.log("changing gamemode to: " + currentGamemode);
        SwitchMusic(false);
      }

    }
    else if (currentGamemode === Gamemode.game) {
      if (player.isDead()) {
        playerDeadSound.currentTime = 0;
        playerDeadSound.play();

        SwitchMusic(true);

        if (foeGenerator.playerScore > bestScore) {
          bestScore = foeGenerator.playerScore;
          record = " - NEW RECORD !"
        } else {
          record = "";
        }
        currentGamemode = Gamemode.dead;
        return;
      } else if (foeGenerator.foes.length < 1) {
        currentGamemode = Gamemode.end;
        return;
      }

      // Display score
      ctx.font = "24px Bourgeois Bold Condensed";
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.fillText("Score: " + foeGenerator.playerScore, 400, 30);
      ctx.fillText("Best: " + bestScore, 400, 55);

      HandleGameInputs();

      player.update(ctx, foeGenerator.foes, keys);
      player.render(ctx);

      foeGenerator.update(ctx, player);

      for (let i = 0; i < foeGenerator.foes.length; i++) {
        foeGenerator.foes[i].render(ctx);
      }

    } else if (currentGamemode === Gamemode.dead) {
      CustomText(ctx, "K.I.A", bigTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2);
      CustomText(ctx, "Score : " + foeGenerator.playerScore + record, mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
      CustomText(ctx, "Press Enter to try again", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2 + 70);

      if (keys["Enter"]) {
        SwitchMusic(false);
        foeGenerator.playerScore = 0;
        currentGamemode = Gamemode.game;
        InitGame();
        console.log("changing gamemode to: " + currentGamemode);
      }
    } else if (currentGamemode === Gamemode.end) {
      CustomText(ctx, "Ultimate Victory!", bigTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2);
      CustomText(ctx, "Press Enter to try again", mediumTextSize, "Bourgeois Bold Condensed", "white", "center", ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);

      if (keys["Enter"]) {
        foeGenerator.playerScore = 0;
        currentGamemode = Gamemode.game;
        InitGame();
        console.log("changing gamemode to: " + currentGamemode);
      }
    }
  }

  if (keys["m"]) {
    music.volume = 0;
    musicDead.volume = 0;
  } else if (keys["p"]) {
    if (currentGamemode === Gamemode.game) {
      music.volume = musicVolume;
    } else {
      musicDead.volume = musicDeadVolume;
    }
  }
}

backgroundImage.onload = function () {
  InitGame();
  gameLoop();
};
