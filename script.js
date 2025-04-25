document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const road = document.querySelector('.road');
    const playerCar = document.querySelector('.player-car');
    const scoreElement = document.querySelector('.score');
    const highScoreElement = document.querySelector('.high-score');
    const countdownElement = document.querySelector('.countdown');
    const gameOverElement = document.querySelector('.game-over');
    const finalScoreElement = document.querySelector('.final-score');
    
    // Audio elements
    const engineSound = document.getElementById('engineSound');
    const crashSound = document.getElementById('crashSound');
    const countdownSound = document.getElementById('countdownSound');
    const goSound = document.getElementById('goSound');
    
    // Game variables
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameSpeed = 20;
    let isGameOver = false;
    let isGameStarted = false;
    let animationId;
    let obstacles = [];
    
    // Player car position
    let playerX = 130;
    const playerWidth = 40;
    const roadWidth = 300;
    
    // Control variables
    let leftPressed = false;
    let rightPressed = false;
    let touchStartX = 0;
    
    // Initialize game
    function init() {
        highScoreElement.textContent = `High Score: ${highScore}`;
        startCountdown();
        setupControls();
    }
    
    // Set up all control listeners
    function setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        // Touch controls for mobile
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Keyboard control handlers
    function handleKeyDown(e) {
        if (!isGameStarted) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                leftPressed = true;
                break;
            case 'ArrowRight':
                rightPressed = true;
                break;
            case 'r':
            case 'R':
                if (isGameOver) resetGame();
                break;
        }
    }
    
    function handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft':
                leftPressed = false;
                playerCar.classList.remove('move-left');
                break;
            case 'ArrowRight':
                rightPressed = false;
                playerCar.classList.remove('move-right');
                break;
        }
    }
    
    // Touch control handlers
    function handleTouchStart(e) {
        if (!isGameStarted) return;
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        if (!isGameStarted) return;
        e.preventDefault();
        
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartX;
        
        if (diff > 15) { // Swipe right
            leftPressed = false;
            rightPressed = true;
            playerCar.classList.add('move-right');
            playerCar.classList.remove('move-left');
        } else if (diff < -15) { // Swipe left
            rightPressed = false;
            leftPressed = true;
            playerCar.classList.add('move-left');
            playerCar.classList.remove('move-right');
        }
    }
    
    function handleTouchEnd() {
        leftPressed = false;
        rightPressed = false;
        playerCar.classList.remove('move-left', 'move-right');
    }
    
    // Start countdown sequence
    function startCountdown() {
        countdownElement.style.display = 'block';
        countdownSound.play();
        
        const countdownSequence = ['3', '2', '1', 'GO!'];
        let count = 0;
        
        const countdownInterval = setInterval(() => {
            if (count < countdownSequence.length) {
                countdownElement.textContent = countdownSequence[count];
                countdownElement.classList.add('pulse');
                
                setTimeout(() => {
                    countdownElement.classList.remove('pulse');
                }, 500);
                
                count++;
            } else {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                startGame();
            }
        }, 1000);
    }
    
    // Start the game
    function startGame() {
        isGameStarted = true;
        isGameOver = false;
        score = 0;
        gameSpeed = 2;
        playerX = 130;
        obstacles = [];
        
        scoreElement.textContent = `Score: ${score}`;
        engineSound.volume = 0.3;
        engineSound.play();
        goSound.play();
        
        gameLoop();
    }
    
    // Game loop
    function gameLoop() {
        if (isGameOver) return;
        
        updatePlayerPosition();
        updateObstacles();
        checkCollisions();
        spawnObstacles();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Update player position based on controls
    function updatePlayerPosition() {
        if (leftPressed && playerX > 20) {
            playerX -= 5;
        }
        if (rightPressed && playerX < roadWidth - playerWidth - 20) {
            playerX += 5;
        }
        
        playerCar.style.left = playerX + 'px';
    }
    
    // Create new obstacles
    function spawnObstacles() {
        if (Math.random() < 0.02) {
            const obstacle = document.createElement('div');
            obstacle.classList.add('obstacle');
            
            const obstacleX = Math.random() * (roadWidth - 70) + 10;
            const hue = Math.random() * 60 - 30;
            const color = `hsl(${15 + hue}, 80%, 50%)`;
            
            obstacle.style.left = obstacleX + 'px';
            obstacle.style.top = '-50px';
            obstacle.style.background = `linear-gradient(135deg, ${color}, hsl(${5 + hue}, 70%, 40%))`;
            
            road.appendChild(obstacle);
            obstacles.push({
                element: obstacle,
                x: obstacleX,
                y: -50,
                width: 50,
                height: 50
            });
        }
    }
    
    // Update obstacle positions
    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            obstacle.y += gameSpeed;
            obstacle.element.style.top = obstacle.y + 'px';
            
            if (obstacle.y > 500) {
                road.removeChild(obstacle.element);
                obstacles.splice(i, 1);
                score++;
                scoreElement.textContent = `Score: ${score}`;
                
                if (score % 5 === 0) {
                    gameSpeed += 0.2;
                    engineSound.playbackRate = 1 + (gameSpeed - 2) * 0.1;
                }
            }
        }
    }
    
    // Check for collisions
    function checkCollisions() {
        const playerRect = {
            x: playerX,
            y: 410,
            width: playerWidth,
            height: 70
        };
        
        for (const obstacle of obstacles) {
            if (
                playerRect.x < obstacle.x + obstacle.width &&
                playerRect.x + playerRect.width > obstacle.x &&
                playerRect.y < obstacle.y + obstacle.height &&
                playerRect.y + playerRect.height > obstacle.y
            ) {
                gameOver();
                break;
            }
        }
    }
    
    // Game over function
    function gameOver() {
        isGameOver = true;
        isGameStarted = false;
        cancelAnimationFrame(animationId);
        
        engineSound.pause();
        crashSound.play();
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = `High Score: ${highScore}`;
        }
        
        finalScoreElement.textContent = score;
        gameOverElement.style.display = 'block';
    }
    
    // Reset game function
    function resetGame() {
        obstacles.forEach(obstacle => {
            road.removeChild(obstacle.element);
        });
        obstacles = [];
        
        gameOverElement.style.display = 'none';
        startCountdown();
    }
    
    // Initialize the game
    init();
});
