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

const player = new Player();

//for move right and left
const keys = {
  right: {
    press: true,
  },
  left: {
    press: true,
  },
};
player.update();

function animated() {
  requestAnimationFrame(animated);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
}

animated();

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);

  switch (keyCode) {
    case 65:
      console.log("left");
      break;

    case 83:
      console.log("down");
      break;

    case 68:
      console.log("right");
      player.velocity.x += 5;
      break;

    case 87:
      console.log("top");
      player.velocity.y -= 20;
      break;
  }
});
