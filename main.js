const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

const gravity = 1;
let score = 0;
let gameOver = false;
let currentLevel = 1;

class Player {
  constructor() {
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 1 };
    this.width = 50;
    this.height = 50;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    else this.velocity.y = 0;
  }
}

class Platform {
  constructor({ x, y }) {
    this.position = { x, y };
    this.width = 300;
    this.height = 20;
  }
  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Enemy {
  constructor({ x, y }) {
    this.position = { x, y };
    this.velocity = { x: Math.random() > 0.5 ? 0.5 : -0.5, y: 0 };
    this.width = 40;
    this.height = 40;
  }
  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.position.x += this.velocity.x;
    if (this.position.x <= 0 || this.position.x + this.width >= canvas.width) {
      this.velocity.x *= -1;
    }
    this.draw();
  }
}

class Coin {
  constructor({ x, y }) {
    this.position = { x, y };
    this.width = 20;
    this.height = 20;
    this.collected = false;
  }
  draw() {
    if (!this.collected) {
      c.fillStyle = "gold";
      c.beginPath();
      c.arc(this.position.x + 10, this.position.y + 10, 10, 0, Math.PI * 2);
      c.fill();
    }
  }
}

const player = new Player();

let platforms = [];
let enemies = [];
let coins = [];
const portal = { x: 0, y: 0, width: 50, height: 80 };
const keys = { right: { press: false }, left: { press: false } };
let scrollOffset = 0;

function showScore() {
  c.fillStyle = "black";
  c.font = "20px Arial";
  c.fillText(`Score: ${score}`, 20, 30);
  c.fillText(`Level: ${currentLevel}`, 20, 60);
}

function endGame(message) {
  gameOver = true;
  const button = document.createElement("button");
  button.textContent = "🔁 إعادة اللعب";
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "10px 20px";
  button.style.fontSize = "20px";
  button.onclick = () => location.reload();
  document.body.appendChild(button);
  alert(message);
}

function checkDeath() {
  if (player.position.y > canvas.height + 100) {
  }
}

function checkEnemyCollision() {
  enemies.forEach((enemy) => {
    if (
      player.position.x < enemy.position.x + enemy.width &&
      player.position.x + player.width > enemy.position.x &&
      player.position.y < enemy.position.y + enemy.height &&
      player.position.y + player.height > enemy.position.y
    ) {
      endGame("💀 اصطدمت بعدو!");
    }
  });
}

function checkCoinCollection() {
  coins.forEach((coin) => {
    if (
      !coin.collected &&
      player.position.x < coin.position.x + coin.width &&
      player.position.x + player.width > coin.position.x &&
      player.position.y < coin.position.y + coin.height &&
      player.position.y + player.height > coin.position.y
    ) {
      coin.collected = true;
      score += 10;
    }
  });
}

function checkLevelTransition() {
  if (
    player.position.x + player.width > portal.x &&
    player.position.x < portal.x + portal.width &&
    player.position.y + player.height > portal.y &&
    player.position.y < portal.y + portal.height
  ) {
    alert(`🎉 انتقلت للمرحلة ${currentLevel + 1}`);
    currentLevel++;
    loadLevel(currentLevel);
  }
}

function generateRandomLevel() {
  platforms = [];
  enemies = [];
  coins = [];

  let x = 200;
  let yOffset = 200;

  if (currentLevel === 1) {
    for (let i = 0; i < 5; i++) {
      let y = yOffset + Math.random() * 300;
      platforms.push(new Platform({ x, y }));

      if (Math.random() < 0.5) {
        enemies.push(new Enemy({ x: x + 100, y: y - 40 }));
      }

      if (Math.random() < 0.5) {
        coins.push(new Coin({ x: x + 150, y: y - 60 }));
      }

      x += 400 + Math.random() * 200;
    }
  } else if (currentLevel === 2) {
    for (let i = 0; i < 5; i++) {
      let y = yOffset + Math.random() * 150;
      platforms.push(new Platform({ x, y }));

      if (Math.random() < 0.7) {
        enemies.push(new Enemy({ x: x + 100, y: y - 40 }));
      }

      if (Math.random() < 0.6) {
        coins.push(new Coin({ x: x + 150, y: y - 60 }));
      }

      x += 300 + Math.random() * 150;
    }
  }

  portal.x = x;
  portal.y = 300;
}

function loadLevel(levelNumber) {
  if (levelNumber > 10) {
    endGame("🎉 فزت بجميع المراحل!");
    return;
  }

  player.position = { x: 100, y: 100 };
  scrollOffset = 0;
  keys.right.press = false;
  keys.left.press = false;

  generateRandomLevel();
}

function animated() {
  if (gameOver) return;
  requestAnimationFrame(animated);

  if (currentLevel === 1) {
    c.fillStyle = "#cce7ff";
  } else if (currentLevel === 2) {
    c.fillStyle = "#ffcccb";
  } else {
    c.fillStyle = "#d3f9d8";
  }

  c.fillRect(0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => platform.draw());
  enemies.forEach((enemy) => enemy.update());
  coins.forEach((coin) => coin.draw());

  c.fillStyle = "purple";
  c.fillRect(portal.x, portal.y, portal.width, portal.height);

  player.update();
  showScore();
  checkDeath();
  checkEnemyCollision();
  checkCoinCollection();
  checkLevelTransition();

  if (keys.right.press && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.press && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.press) {
      scrollOffset += 5;
      score++;
      platforms.forEach((platform) => (platform.position.x -= 5));
      enemies.forEach((enemy) => (enemy.position.x -= 5));
      coins.forEach((coin) => (coin.position.x -= 5));
      portal.x -= 5;
    } else if (keys.left.press) {
      scrollOffset -= 5;
      platforms.forEach((platform) => (platform.position.x += 5));
      enemies.forEach((enemy) => (enemy.position.x += 5));
      coins.forEach((coin) => (coin.position.x += 5));
      portal.x += 5;
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
}

addEventListener("keydown", ({ keyCode }) => {
  if (gameOver) return;
  switch (keyCode) {
    case 65:
      keys.left.press = true;
      break;
    case 68:
      keys.right.press = true;
      break;
    case 87:
      if (player.velocity.y === 0) {
        player.velocity.y -= 35;
      }
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.press = false;
      break;
    case 68:
      keys.right.press = false;
      break;
  }
});

loadLevel(currentLevel);
animated();
