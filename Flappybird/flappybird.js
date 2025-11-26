let context;
let toppipeIMG = new Image();
let bottompipeIMG = new Image();
let birdIMG = new Image();
let backgroundIMG = new Image();
let playButtonIMG = new Image();

const boardwidth = 360;
const boardheight = 640;

let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;
let pipeArray = [];
let pipeV = 200;

let birdW = 34;
let birdH = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;
let bird = {
    x: birdX,
    y: birdY,
    w: birdW,
    h: birdH

}




velocity = 0;
const gaccel = 15; //pixels per second squared
const jumpv = -350;
let gameover = false;

let lastTime = 0; // in ms
let delta;


window.onload = function () {
    const board = document.getElementById("board");
    context = board.getContext("2d");//get the canvas basically 
    board.height = boardheight;
    board.width = boardwidth;

    toppipeIMG.src = "toppipe.png";
    bottompipeIMG.src = "bottompipe.png";
    birdIMG.src = "flappybird.png";
    backgroundIMG.src = "flappybirdbg.png";
    playButtonIMG.src = "playbutton.png";
    birdIMG.onload = function () {
        context.drawImage(birdIMG, birdX, birdY, birdW, birdH);
    }

    requestAnimationFrame(update);
    this.setInterval(pipes, 1500);
    board.addEventListener('click', click);
    document.addEventListener("keydown", moveBird);//load event listener
};



function update(timestamp) {
    delta = getDeltaTime(timestamp);
    requestAnimationFrame(update);

    if (gameover == false) {
        context.drawImage(backgroundIMG, 0, 0, boardwidth, boardheight);
        drawImageCentered(birdIMG, bird.x, bird.y, bird.w, bird.h);//draw bird more 
        gravity(delta);
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x -= pipeV * delta;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
            topbird = {
                x: bird.x - bird.w / 2,
                y: bird.y - bird.h / 2,
                w: bird.w,
                h: bird.h
            }
            if (collision(topbird, pipe)) {
                gameover = true;

            }
        }
    }
    bottom();
}


function pipes() {
    if (gameover) {
        return;
    }
    pipeY = Math.floor(Math.random() * (420) - 470);//random pipe placement

    let openingSpace = board.height / 4;

    let topPipe = {
        img: toppipeIMG,
        x: pipeX,
        y: pipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottompipeIMG,
        x: pipeX,
        y: pipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);

}


function getDeltaTime(timestamp) {
    // first frame: no movement
    if (!lastTime) {
        lastTime = timestamp;
        return 0;
    }

    const delta = (timestamp - lastTime) / 1000; // convert to seconds
    lastTime = timestamp;
    return delta;
}

function gravity(delta) {
    velocity += gaccel *delta;
    bird.y += velocity * delta;

}
function bottom() {
    if (bird.y + bird.h / 2 >= boardheight) {
        bird.y = boardheight - bird.h / 2;
        velocity = 0;
    }
}
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        if (gameover == false) {
            velocity = jumpv;
        }
    }
}

function click(e) {
    if (gameover == false) {
        velocity = jumpv;
    }
}

function drawImageCentered(img, x, y, w, h) {
    context.drawImage(img, x - w / 2, y - h / 2, w, h);
}

function collision(a, b) {
    if (a.x < b.x + b.width && a.x + a.w > b.x && a.y < b.y + b.height && a.y + a.h > b.y) {
        return true
    } else if (a.y + a.h > boardheight) {
        return true
    }
}