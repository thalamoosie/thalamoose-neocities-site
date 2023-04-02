"use strict";
/* Snake Game
Cobbled from Coding With Adam & Kenny Yip Coding's tutorials
+ Lessons from Jonas Schmedtmann's Courses
*/

////////////////////////////////////
// Canvas Setup
////////////////////////////////////
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const canvasX = canvas.width;
const canvasY = canvas.height;
console.log(canvasX, canvasY);

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvasX / tileCount - 2;
console.log(tileSize);

// Snake Construction
let headX = 12;
let headY = 12;

const snakeBody = [];
let tailLength = 1;

const snakeColor = "#414a3f";
const snakeBodyColor = "#222926";
const foodColor = "#171113";

// Snake Velocity
let xVelocity = 0;
let yVelocity = 0;

// Food
let foodX = 5;
let foodY = 5;

// Score
let score = 0;
const scored = document.querySelector(".score");
console.log(scored);

let screenGradient = ctx.createLinearGradient(0, 0, 0, canvasX);
screenGradient.addColorStop(0, "#d2edc2");
screenGradient.addColorStop(0.7, "#bdddb2");
screenGradient.addColorStop(1, "#8eab80");

// Game Loop

const drawGame = function () {
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  clearScreen();
  checkFoodCollision();
  drawFood();
  drawSnake();

  if (score > 2) speed = 10;
  if (score > 6) speed = 12;
  if (score > 10) speed = 15;

  setTimeout(drawGame, 1000 / speed);
};

// const drawScore = function () {
//   ctx.fillStyle = "white";
//   ctx.fillText(`Score: ${score}`, canvasX - 50, 10);
// };

const isGameOver = function () {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  // Walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  // Body
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "gray";
    ctx.font = "50px Nokia Cellphone FC";

    if (gameOver) {
      let gradient = ctx.createLinearGradient(0, 0, 0, canvasX);
      gradient.addColorStop(0, "#171113");
      gradient.addColorStop(0.3, "#222926");
      gradient.addColorStop(1, "#414a3f");
      ctx.fillStyle = gradient;
    }

    ctx.fillText(`You Died.`, canvasX / 6.5, canvasY / 2);
  }
  return gameOver;
};

const clearScreen = function () {
  ctx.fillStyle = screenGradient;
  ctx.fillRect(0, 0, canvasX, canvasY);
};

const drawSnake = function () {
  ctx.fillStyle = snakeColor;
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

  ctx.fillStyle = snakeBodyColor;
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  // Put an item at end of list next to head
  // Remove the furthest item from the snake body if we have more than our tail size
  snakeBody.push(new SnakePart(headX, headY));
  while (snakeBody.length > tailLength) snakeBody.shift();
};

const drawFood = function () {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX * tileCount, foodY * tileCount, tileSize, tileSize);
};

const positionRandomizer = function (x) {
  return Math.floor(Math.random() * x);
};

const checkFoodCollision = function () {
  if (foodX == headX && foodY == headY) {
    foodX = positionRandomizer(tileCount);
    foodY = positionRandomizer(tileCount);
    tailLength++;
    score++;
    scored.textContent = score;
  }
};

const changeSnakePosition = function () {
  headX += xVelocity;
  headY += yVelocity;
};

// Input Controls
const keyPress = function (e) {
  // UP
  if (e.code == "KeyW" || e.code == "ArrowUp") {
    if (yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }
  // DOWN
  if (e.code == "KeyS" || e.code == "ArrowDown") {
    if (yVelocity == -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }
  // LEFT
  if (e.code == "KeyA" || e.code == "ArrowLeft") {
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }
  // RIGHT
  if (e.code == "KeyD" || e.code == "ArrowRight") {
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
};

document.body.addEventListener("keydown", keyPress);

drawGame();
