const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let currentLevel = 500;
let mute = false;

let sound = new Howl({
  src: ["sounds/music/DST-DasElectron.mp3"],
  autoplay: false,
  loop: true,
  volume: 0.08,
});

const soundEffects = {
  laserSound: new Howl({
    src: ["sounds/sfx/sfx_laser2.mp3"],
    volume: 0.1,
  }),
  gameOverSound: new Howl({
    src: ["sounds/sfx/explosion.mp3"],
    volume: 0.1,
  }),
  boomSound: new Howl({
    src: ["sounds/sfx/sfx_laser1.mp3"],
    volume: 0.1,
  }),
  borderSound: new Howl({
    src: ["sounds/sfx/death.mp3"],
    volume: 0.1,
  }),
  levelUpSound: new Howl({
    src: ["sounds/sfx/levelUp.mp3"],
    volume: 0.5,
  }),
  levelDoneSound: new Howl({
    src: ["sounds/sfx/sfx_zap.mp3"],
    volume: 0.5,
  }),
  invadersMoveSound: new Howl({
    src: ["sounds/sfx/sfx_lose.mp3"],
    volume: 0.35,
  }),
};

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

function Refresh() {
  window.parent.location = window.parent.location.href;
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const levels = {
  level500: [0, 2, 4, 6, 8, 15, 17, 19, 21, 23, 30, 32, 34, 36, 38],
  level450: [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 17, 19, 21, 23, 30, 32, 34, 36, 38],
  level400: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 19, 21, 22, 23, 30, 32, 34, 36, 38,
  ],
  level350: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 32, 34,
    36, 38,
  ],
  level300: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32,
    34, 36, 37, 38,
  ],
  level250: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32,
    33, 34, 35, 36, 37, 38,
  ],
  level200: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 17, 18, 19, 20, 21, 23, 30, 31, 32, 33, 34,
    35, 36, 37, 38,
  ],
  level150: [
    0, 2, 3, 4, 5, 6, 7, 9, 15, 16, 17, 18, 21, 22, 23, 24, 30, 31, 32, 33, 34,
    35, 36, 37, 38, 39,
  ],
  level100: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 21, 22, 23, 24, 30, 31, 32,
    33, 34, 35, 36, 37, 38, 39,
  ],
  level50: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ],
};

let alienInvaders = [...levels.level500];
let squareInvaders = [...squares];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squareInvaders[alienInvaders[i]].classList.add("invader");
    }
  }
}

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squareInvaders[alienInvaders[i]].classList.remove("invader");
  }
}

squareInvaders[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  squareInvaders[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
    case "a":
    case "A":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squareInvaders[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();
  soundEffects.invadersMoveSound.play();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  if (
    squareInvaders[currentShooterIndex].classList.contains("invader", "shooter")
  ) {
    resultsDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
    document.getElementById("restart").removeAttribute("disabled");
    soundEffects.gameOverSound.play();
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squareInvaders.length - 15) {
      resultsDisplay.innerHTML = "GAME OVER";
      clearInterval(invadersId);
      document.getElementById("restart").removeAttribute("disabled");
      soundEffects.gameOverSound.play();
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
    document.getElementById("restart").removeAttribute("disabled");
    if (currentLevel > 50) {
      soundEffects.levelDoneSound.play();
      currentLevel = currentLevel - 50;
      if (results < 1430) {
        document.getElementById("next-level").removeAttribute("disabled");
      }
    } else {
      resultsDisplay.innerHTML = "Congratulations, you passed all levels!";
    }
  }
}

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  let laserPosition = 0;
  function moveLaser() {
    squareInvaders[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squareInvaders[currentLaserIndex].classList.add("laser");
    laserPosition++;

    if (laserPosition > 12) {
      squareInvaders[currentLaserIndex].classList.remove("laser");
      squareInvaders[currentLaserIndex].classList.add("boomLaser");
      setTimeout(
        () => squareInvaders[currentLaserIndex].classList.remove("boomLaser"),
        200
      );
      clearInterval(laserId);
      soundEffects.borderSound.play();
    }

    if (squareInvaders[currentLaserIndex].classList.contains("invader")) {
      squareInvaders[currentLaserIndex].classList.remove("laser");
      squareInvaders[currentLaserIndex].classList.remove("invader");
      squareInvaders[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squareInvaders[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      switch (currentLevel) {
        case 500:
          results++;
          break;
        case 450:
          results += 2;
          break;
        case 400:
          results += 3;
          break;
        case 350:
          results += 4;
          break;
        case 300:
          results += 5;
          break;
        case 250:
          results += 6;
          break;
        case 200:
          results += 7;
          break;
        case 150:
          results += 8;
          break;
        case 100:
          results += 9;
          break;
        case 50:
          results += 10;
          break;
      }
      resultsDisplay.innerHTML = results;
      soundEffects.boomSound.play();
    }
  }
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      laserId = setInterval(moveLaser, currentLevel / 5);
      soundEffects.laserSound.play();
  }
}

const restart = () => {
  for (let i = 0; i < squareInvaders.length; i++) {
    squareInvaders[i].classList.remove("invader");
  }
  squareInvaders = [...squares];
  clearInterval(invadersId);
  alienInvaders = [...levels.level500];
  aliensRemoved = [];
  currentLevel = 500;
  results = 0;
  resultsDisplay.innerHTML = results;
  invadersId = setInterval(moveInvaders, 500);
  document.getElementById("restart").disabled = true;
  document.getElementById("restart").innerHTML = "Restart";
  document.getElementById("next-level").disabled = true;
  if (!sound.playing()) {
    sound.play();
  }
};

const nextLevel = () => {
  switch (currentLevel) {
    case 500:
      alienInvaders = [...levels.level500];
      break;
    case 450:
      alienInvaders = [...levels.level450];
      break;
    case 400:
      alienInvaders = [...levels.level400];
      break;
    case 350:
      alienInvaders = [...levels.level350];
      break;
    case 300:
      alienInvaders = [...levels.level300];
      break;
    case 250:
      alienInvaders = [...levels.level250];
      break;
    case 200:
      alienInvaders = [...levels.level200];
      break;
    case 150:
      alienInvaders = [...levels.level150];
      break;
    case 100:
      alienInvaders = [...levels.level100];
      break;
    case 50:
      alienInvaders = [...levels.level50];
      break;
  }
  aliensRemoved = [];
  invadersId = setInterval(moveInvaders, currentLevel);
  document.getElementById("restart").disabled = true;
  document.getElementById("next-level").disabled = true;
  soundEffects.levelUpSound.play();
};

const muteMusic = () => {
  if (!sound.playing()) {
    sound.play();
    document.getElementById("muteMusic").innerHTML = "Unmute Music";
  } else {
    sound.pause();
    document.getElementById("muteMusic").innerHTML = "Mute Music";
  }
};

const muteAllSounds = () => {
  if (mute) {
    soundEffects.laserSound.volume(0.1);
    soundEffects.gameOverSound.volume(0.1);
    soundEffects.boomSound.volume(0.1);
    soundEffects.borderSound.volume(0.1);
    soundEffects.levelUpSound.volume(0.5);
    soundEffects.levelDoneSound.volume(0.5);
    soundEffects.invadersMoveSound.volume(0.35);
    mute = false;
    document.getElementById("muteAllSounds").innerHTML = "Mute All Sounds";
  } else {
    soundEffects.laserSound.volume(0);
    soundEffects.gameOverSound.volume(0);
    soundEffects.boomSound.volume(0);
    soundEffects.borderSound.volume(0);
    soundEffects.levelUpSound.volume(0);
    soundEffects.levelDoneSound.volume(0);
    soundEffects.invadersMoveSound.volume(0);
    mute = true;
    document.getElementById("muteAllSounds").innerHTML = "Unmute";
  }
};

const laser = () => {
  shoot((e = { key: "ArrowUp" }));
};

const moveLeft = () => {
  moveShooter((e = { key: "ArrowLeft" }));
};

const moveRight = () => {
  moveShooter((e = { key: "ArrowRight" }));
};

document.addEventListener("keydown", shoot);
