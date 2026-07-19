// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleHeight = 80;
const paddleWidth = 10;
const ballSize = 5;

let gameRunning = false;

// Paddles
const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballSize
};

// Score
let score1 = 0;
let score2 = 0;

// Keyboard controls
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Start/Pause with spacebar
    if (e.key === ' ') {
        e.preventDefault();
        gameRunning = !gameRunning;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw elements
    drawCenterLine();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
}

// Update functions
function updatePaddles() {
    // Player 1 controls (W/S)
    if (keys['w'] || keys['W']) {
        player1.y = Math.max(0, player1.y - player1.speed);
    }
    if (keys['s'] || keys['S']) {
        player1.y = Math.min(canvas.height - player1.height, player1.y + player1.speed);
    }
    
    // Player 2 controls (Arrow keys)
    if (keys['ArrowUp']) {
        player2.y = Math.max(0, player2.y - player2.speed);
    }
    if (keys['ArrowDown']) {
        player2.y = Math.min(canvas.height - player2.height, player2.y + player2.speed);
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }
    
    // Paddle collision - Player 1
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player1.x + player1.width + ball.radius;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - (player1.y + player1.height / 2)) / (player1.height / 2);
        ball.dy = hitPos * 5;
    }
    
    // Paddle collision - Player 2
    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player2.x - ball.radius;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - (player2.y + player2.height / 2)) / (player2.height / 2);
        ball.dy = hitPos * 5;
    }
    
    // Out of bounds - scoring
    if (ball.x - ball.radius < 0) {
        score2++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        score1++;
        resetBall();
    }
    
    // Update score display
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 4;
}

// Game loop
function update() {
    if (gameRunning) {
        updatePaddles();
        updateBall();
    }
    
    draw();
    requestAnimationFrame(update);
}

// Start the game
update();
