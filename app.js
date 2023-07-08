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

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

function Refresh() {
  window.parent.location = window.parent.location.href;
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const level500 = [0, 2, 4, 6, 8, 15, 17, 19, 21, 23, 30, 32, 34, 36, 38];
const level450 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 17, 19, 21, 23, 30, 32, 34, 36, 38,
];
const level400 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 19, 21, 22, 23, 30, 32, 34, 36, 38,
];
const level350 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 32, 34, 36,
  38,
];
const level300 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 34,
  36, 37, 38,
];
const level250 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 33,
  34, 35, 36, 37, 38,
];
const level200 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 17, 18, 19, 20, 21, 23, 30, 31, 32, 33, 34, 35,
  36, 37, 38,
];
const level150 = [
  0, 2, 3, 4, 5, 6, 7, 9, 15, 16, 17, 18, 21, 22, 23, 24, 30, 31, 32, 33, 34,
  35, 36, 37, 38, 39,
];
const level100 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 21, 22, 23, 24, 30, 31, 32, 33,
  34, 35, 36, 37, 38, 39,
];
const level50 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

let alienInvaders = [...level500];
let squareInvaders = [...squares];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squareInvaders[alienInvaders[i]].classList.add("invader");
    }
  }
}

draw();

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
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squareInvaders.length - 15) {
      resultsDisplay.innerHTML = "GAME OVER";
      clearInterval(invadersId);
      document.getElementById("restart").removeAttribute("disabled");
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
    document.getElementById("restart").removeAttribute("disabled");
    if (currentLevel > 50) {
      currentLevel = currentLevel - 50;
      if (results < 1430) {
        document.getElementById("next-level").removeAttribute("disabled");
      }
    } else {
      resultsDisplay.innerHTML = "Congratulations, you passed all levels!";
    }
  }
}
invadersId = setInterval(moveInvaders, currentLevel);

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
    }
  }
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      laserId = setInterval(moveLaser, currentLevel / 5);
  }
}

const restart = () => {
  for (let i = 0; i < squareInvaders.length; i++) {
    squareInvaders[i].classList.remove("invader");
  }
  squareInvaders = [...squares];
  clearInterval(invadersId);
  alienInvaders = [...level500];
  aliensRemoved = [];
  currentLevel = 500;
  results = 0;
  invadersId = setInterval(moveInvaders, 500);
  document.getElementById("restart").disabled = true;
  document.getElementById("next-level").disabled = true;
};

const nextLevel = () => {
  switch (currentLevel) {
    case 500:
      alienInvaders = [...level500];
      break;
    case 450:
      alienInvaders = [...level450];
      break;
    case 400:
      alienInvaders = [...level400];
      break;
    case 350:
      alienInvaders = [...level350];
      break;
    case 300:
      alienInvaders = [...level300];
      break;
    case 250:
      alienInvaders = [...level250];
      break;
    case 200:
      alienInvaders = [...level200];
      break;
    case 150:
      alienInvaders = [...level150];
      break;
    case 100:
      alienInvaders = [...level100];
      break;
    case 50:
      alienInvaders = [...level50];
      break;
  }
  aliensRemoved = [];
  invadersId = setInterval(moveInvaders, currentLevel);
  document.getElementById("restart").disabled = true;
  document.getElementById("next-level").disabled = true;
};

document.addEventListener("keydown", shoot);
