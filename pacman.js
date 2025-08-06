// board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

// game layout
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set(); 
const foods = new Set(); 
const ghosts = new Set();
let pacman;
const directions = ['U', 'D', 'L', 'R'];

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // for drawing on board
    loadImages();
    loadMap();

    // assign random direction to ghosts
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)]; // 0-3
        ghost.updateDirection(newDirection);
    }

    update();
    addEventListener('keyup', movePacman); 
}

// load images for game
function loadImages() {
    wallImage = new Image();
    wallImage.src = "./wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "./pinkGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "./redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanRight.png";
}

// setup initial game layout
function loadMap() {
    // resetting layout
    walls.clear();
    foods.clear();
    ghosts.clear();

    // create Block representing each game tile
    for (let r = 0; r < rowCount; r++) { //row
        for (let c = 0; c < columnCount; c++) { //column
            const row = tileMap[r];
            const tileMapChar = row[c];

            // pixel position
            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') { // wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall); 
            }
            else if (tileMapChar == 'b') { // blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { // orange ghost
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { // pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { // red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') { // pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { // empty space are food 
                // food image is 4 x 4 and positioned in center of 32 x 32 tile 
                const food = new Block(null, x + 14, y + 14, 4, 4); 
                foods.add(food);
            }
        }
    }
}

// update game layout
function update() {
    move();
    draw();
    setTimeout(update, 50); // update at 20 FPS, 1 second = 1000 ms, 1000/20 = 50ms
}

// display game graphics
function draw() {
    context.clearRect(0, 0, board.width, board.height); // clear previous graphics
    // pacman
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);

    // ghosts
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    // wall
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    
    // food doesn't have image, so creating square for it
    context.fillStyle = 'white';
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}

// update x and y position of Pacman
function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    // check wall collisions
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {

        // check if ghost is stuck moving left and right on 9th row
        if (ghost.y === tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D') {
            ghost.updateDirection('U'); // force ghost to move up
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        for (let wall of walls.values()) {
            if (collision(ghost, wall) 
                || ghost.x <= 0 // left side of screen
                || ghost.x + ghost.width >= boardWidth // right side of screen
            ) {
                // take a step back and change to random direction
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection);
            }
        }
    }
}

// move Pacman based on key press
function movePacman(e) {
    if (e.code == 'ArrowUp' || e.code == 'KeyW') { // up
        pacman.updateDirection('U');
    }
    else if (e.code == 'ArrowDown' || e.code == 'KeyS') { // down
        pacman.updateDirection('D');
    }
    else if (e.code == 'ArrowLeft' || e.code == "KeyA") { // left
        pacman.updateDirection('L');
    }
    else if (e.code == 'ArrowRight' || e.code == "KeyD") { // right
        pacman.updateDirection('R');
    }

    // update Pacman image
    if (pacman.direction == 'U') { // up
        pacman.image = pacmanUpImage;
    }
    else if (pacman.direction == 'D') { // down
        pacman.image = pacmanDownImage;
    }
    else if (pacman.direction == 'L') { // left
        pacman.image = pacmanLeftImage;
    }
    else if (pacman.direction == 'R') { // right
        pacman.image = pacmanRightImage;
    }
}

// check collision between Block a and Block b
function collision(a, b) {
    // collision happens when there's an intersection of two Blocks
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// represents each tile on game board
class Block {
    constructor(image, x, y, width, height) {
        this.image = image; // current image on block
        this.x = x; // x position on board
        this.y = y; // y position on board
        this.width = width; // image size
        this.height = height;

        // original position
        this.startX = x;
        this.startY = y;

        this.direction = 'R'; // right
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        // check if moving in direction where there's a wall in the way
        for (let wall of walls.values()) {
            if (collision(this, wall)) { // wall in the way, step back to previous position
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        if (this.direction == 'U') { // moving up
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D') { // moving down
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        }
        else if (this.direction == 'L') { // moving left
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') { // moving right
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }

    }
}