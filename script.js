document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const road = document.querySelector('.road');
    const playerCar = document.querySelector('.player-car');
    const scoreElement = document.querySelector('.score');
    const highScoreElement = document.querySelector('.high-score');
    const countdownElement = document.querySelector('.countdown');
    const gameOverElement = document.querySelector('.game-over');
    const finalScoreElement = document.querySelector('.final-score');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    // Audio elements
    const engineSound = document.getElementById('engineSound');
    const crashSound = document.getElementById('crashSound');
    const countdownSound = document.getElementById('countdownSound');
    const goSound = document.getElementById('goSound');
    
    // Game variables
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameSpeed = 5;
    let isGameOver = false;
    let isGameStarted = false;
    let animationId;
    let opponents = [];
    let roadItems = [];
    
    // Player car position
    let playerX = 130;
    const playerWidth = 40;
    const roadWidth = 300;
    
    // Control variables
    let leftPressed = false;
    let rightPressed = false;
    let touchStartX = 0;
    
    // Car colors for opponents
    const carColors = [
        'linear-gradient(135deg, #e74c3c, #c0392b)',
        'linear-gradient(135deg, #2ecc71, #27ae60)',
        'linear-gradient(135deg, #f39c12, #d35400)',
        'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'linear-gradient(135deg, #1abc9c, #16a085)'
    ];
    
    // Initialize game
    function init() {
        highScoreElement.textContent = `High Score: ${highScore}`;
        startCountdown();
        setupControls();
        createRoadItems();
    }
    
    // Create road items (decorations)
    function createRoadItems() {
        // Add some roadside items
        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div');
            item.className = 'road-item';
            item.style.position = 'absolute';
            item.style.width = '20px';
            item.style.height = '20px';
            item.style.background = '#555';
            item.style.borderRadius = '50%';
            item.style.left = (Math.random() > 0.5 ? 20 : 260) + 'px';
            item.style.top = (Math.random() * 1000) + 'px';
            road.appendChild(item);
            roadItems.push({
                element: item,
                y: parseFloat(item.style.top)
            });
        }
    }
    
    // Set up all control listeners
    function setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        // Button controls
        leftBtn.addEventListener('mousedown', () => leftPressed = true);
        leftBtn.addEventListener('mouseup', () => leftPressed = false);
        leftBtn.addEventListener('mouseleave', () => leftPressed = false);
        rightBtn.addEventListener('mousedown', () => rightPressed = true);
        rightBtn.addEventListener('mouseup', () => rightPressed = false);
        rightBtn.addEventListener('mouseleave', () => rightPressed = false);
        
        // Touch controls for mobile
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            leftPressed = true;
        });
        leftBtn.addEventListener('touchend', () => leftPressed = false);
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            rightPressed = true;
        });
        rightBtn.addEventListener('touchend', () => rightPressed = false);
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
        gameSpeed = 5;
        playerX = 130;
        opponents = [];
        
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
        updateOpponents();
        updateRoadItems();
        checkCollisions();
        spawnOpponents();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Update player position based on controls
    function updatePlayerPosition() {
        if (leftPressed && playerX > 10) {
            playerX -= 8;
            playerCar.classList.add('move-left');
            playerCar.classList.remove('move-right');
        } else if (rightPressed && playerX < roadWidth - playerWidth - 10) {
            playerX += 8;
            playerCar.classList.add('move-right');
            playerCar.classList.remove('move-left');
        } else {
            playerCar.classList.remove('move-left', 'move-right');
        }
        
        playerCar.style.left = playerX + 'px';
    }
    
    // Create new opponent cars
    function spawnOpponents() {
        if (Math.random() < 0.02 && opponents.length < 3) {
            const opponent = document.createElement('div');
            opponent.className = 'opponent-car';
            
            const opponentX = Math.random() * (roadWidth - 60) + 10;
            const color = carColors[Math.floor(Math.random() * carColors.length)];
            
            opponent.style.left = opponentX + 'px';
            opponent.style.top = '-70px';
            
            opponent.innerHTML = `
                <div class="opponent-body" style="background: ${color}"></div>
                <div class="car-top" style="background: ${color.replace('135deg', '315deg')}"></div>
                <div class="car-window"></div>
                <div class="car-light left"></div>
                <div class="car-light right"></div>
                <div class="car-wheel front-left"></div>
                <div class="car-wheel front-right"></div>
                <div class="car-wheel rear-left"></div>
                <div class="car-wheel rear-right"></div>
            `;
            
            road.appendChild(opponent);
            opponents.push({
                element: opponent,
                x: opponentX,
                y: -70,
                width: 40,
                height: 70,
                speed: 3 + Math.random() * 3
            });
        }
    }
    
    // Update opponent positions
    function updateOpponents() {
        for (let i = opponents.length - 1; i >= 0; i--) {
            const opponent = opponents[i];
            opponent.y += opponent.speed;
            opponent.element.style.top = opponent.y + 'px';
            
            // Random left/right movement for opponents
            if (Math.random() <  0.02) {
                        const move = Math.random() > 0.5 ? 1 : -1;
                        opponent.x = Math.max(10, Math.min(roadWidth - opponent.width - 10, opponent.x + (move * 20)));
                        opponent.element.style.left = opponent.x + 'px';
                    }
                    
                    if (opponent.y > 500) {
                        road.removeChild(opponent.element);
                        opponents.splice(i, 1);
                        score++;
                        scoreElement.textContent = `Score: ${score}`;
                        
                        // Increase difficulty
                        if (score % 10 === 0) {
                            gameSpeed += 0.5;
                            engineSound.playbackRate = 1 + (gameSpeed - 5) * 0.05;
                        }
                    }
                }
            }
            
            // Update road items positions
            function updateRoadItems() {
                roadItems.forEach(item => {
                    item.y += gameSpeed / 2;
                    if (item.y > 500) {
                        item.y = -20;
                        item.element.style.left = (Math.random() > 0.5 ? 20 : 260) + 'px';
                    }
                    item.element.style.top = item.y + 'px';
                });
            }
            
            // Check for collisions
            function checkCollisions() {
                const playerRect = {
                    x: playerX,
                    y: 410,
                    width: playerWidth,
                    height: 70
                };
                
                for (const opponent of opponents) {
                    if (
                        playerRect.x < opponent.x + opponent.width &&
                        playerRect.x + playerRect.width > opponent.x &&
                        playerRect.y < opponent.y + opponent.height &&
                        playerRect.y + playerRect.height > opponent.y
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
                opponents.forEach(opponent => {
                    road.removeChild(opponent.element);
                    });
                opponents = [];
                
                gameOverElement.style.display = 'none';
                startCountdown();
            }
            
            // Initialize the game
            init();
        });
