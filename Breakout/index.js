// htmlの要素を取得
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// ボールの初期配置位置
let x = canvas.width/2;
let y = canvas.height-30;
// 縦横の動く速度
let dx = 2;
let dy = -2;
// ボールの半径
const ballRadius = 10;
// パドル関連の変数
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
// キーボード操作用の変数
let rightPressed = false;
let leftPressed = false;
// ブロックの変数
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
// スコア追加
let score = 0;
// プレーヤーライフポイント
let lives = 3;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBAll() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStype = "#0095D";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawlives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

// キーボードが押されているか検知
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function draw() {
    // 軌跡の削除
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBAll();
    drawPaddle();
    drawScore();
    drawlives();
    collisionDetection();

    // ボールのバウンド処理
    if(x+dx > canvas.width-ballRadius || x+dx < ballRadius) {
        dx = -dx;
    }
    if(y+dy < ballRadius) {
        dy = -dy;
    } else if(y+dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // パドルの操作
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

// 間隔をおいて描画を実行
let interval = setInterval(draw, 10);