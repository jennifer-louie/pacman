// board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

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
    update();
}

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
    draw();
    setTimeout(update, 50); // update at 20 FPS, 1 second = 1000 ms, 1000/20 = 50ms

}

// display game graphics
function draw() {
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
    }
}