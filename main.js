const canvas = document.querySelector("canvas");

//for screen window
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const gravity = 0.3;

//create player
class Player {
  constructor() {
    //position of character
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    //size of character
    this.width = 50;
    this.height = 50;
  }
  //for now color charachter
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

//the env of game
class Platform {
  constructor({ x, y }) {
    this.position = {
      x: x,
      y: y,
    };

    this.width = 300;
    this.height = 20;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

//create object from class
const player = new Player();


//قمنا بجعل الكلاس داخل مصفوفة لكي نستخدمه اكثر مره 
//البلاتفورم هو بئية اللعبة الحواجز الذي يقف عليها اللاعب
const platforms = [
  new Platform({
    x: 200,
    y: 300,
  }),
  new Platform({
    x: 300,
    y: 600,
  }),
];

//for move right and left
const keys = {
  right: {
    press: false,
  },
  left: {
    press: false,
  },
};
player.update();

let scrollOffset = 0
function animated() {
  requestAnimationFrame(animated);

  c.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  //التحكم بسرعة وتوقف الازرار والبيئة الخاصة باللعبة عند التحرك تختفي رتظهر علي حسب اتجاه اللاعب
  if (keys.right.press && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.press && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.press) {
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.press) {
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.width + player.position.x >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
}

animated();

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);

  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.press = true;
      player.velocity.x -= 1;
      break;

    case 83:
      console.log("down");
      break;

    case 68:
      console.log("right");
      keys.right.press = true;
      player.velocity.x += 1;
      break;

    case 87:
      console.log("top");
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);

  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.press = false;
      player.velocity.x = 0;
      break;

    case 83:
      console.log("down");
      break;

    case 68:
      console.log("right");
      keys.right.press = false;
      player.velocity.x = 0;
      break;

    case 87:
      console.log("top");
      player.velocity.y = 0;
      break;
  }
});
