let myGamePiece;
let obstacles = [];
let score = 0;

function startGame() {
    myGameArea.start();
    myGamePiece = new component(40, 60, "mario", 10, 530); // Use "mario" as color
    requestAnimationFrame(updateGame);

    document.addEventListener('keydown', function (e) {
        if (e.key === "ArrowRight") {
            myGamePiece.x += 10;
        }
        if (e.key === "ArrowLeft") {
            myGamePiece.x -= 10;
        }
        if (e.key === "ArrowUp") {
            let originalY = myGamePiece.y;
            myGamePiece.y -= 150;
            myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
            myGamePiece.update();
            drawObstacles();
            drawScore();
            setTimeout(function () {
                myGamePiece.y = originalY;
                myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
                myGamePiece.update();
                drawObstacles();
                drawScore();
            }, 800);
            return;
        } if (score === 100) {
            alert("You win! Your score: " + score);
            window.location.reload();
            return;

        }
        myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
        myGamePiece.update();
        drawObstacles();
        drawScore();
    });
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1430;
        this.canvas.height = 590;
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 1;
        this.canvas.style.border = "1px solid #000";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.canvas.style.pointerEvents = "none"; // Disable pointer events
        this.canvas.style.userSelect = "none"; // Disable text selection
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isPipe = color === "pipe";
    this.isMario = color === "mario";
    this.update = function () {
        let ctx = myGameArea.context;
        if (this.isPipe) {
            let img = document.getElementById("pipe-img");
            if (img) {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
        } else if (this.isMario) {
            let img = document.getElementById("mario-img");
            if (img) {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function (other) {
        return !(
            this.x + this.width < other.x ||
            this.x > other.x + other.width ||
            this.y + this.height < other.y ||
            this.y > other.y + other.height
        );
    }
    this.update();
}

// Create a new obstacle every 120 frames
let frameCount = 0;
function updateGame() {
    frameCount++;
    score = Math.floor(frameCount / 10); // Score increases with time

    // Add a new obstacle every 120 frames
    if (frameCount % 120 === 0) {
        let height = Math.floor(Math.random() * 100) + 50;
        let y = myGameArea.canvas.height - height;
        obstacles.push(new component(40, height, "pipe", myGameArea.canvas.width, y));
    }

    // Move obstacles to the left
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 8;
    }

    // Remove obstacles that are off screen
    obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

    // Check for collision
    for (let i = 0; i < obstacles.length; i++) {
        if (myGamePiece.crashWith(obstacles[i])) {
            alert("Game Over! Your score: " + score);
            window.location.reload();
            return;
        }
    }

    // Redraw everything
    myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    myGamePiece.update();
    drawObstacles();
    drawScore();

    // Keep the game loop running
    requestAnimationFrame(updateGame);
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
}

function drawScore() {
    let ctx = myGameArea.context;
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 30, 50);
}