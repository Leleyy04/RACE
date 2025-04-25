@import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    font-family: 'Arial', sans-serif;
    overflow: hidden;
    color: white;
}

.game-container {
    position: relative;
    width: 300px;
    height: 500px;
    overflow: hidden;
    background-color: #111;
    border: 4px solid #444;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
}

.road {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #333;
    overflow: hidden;
}

/* Road markings with animation */
.road::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 200%;
    background: repeating-linear-gradient(
        to bottom,
        #fff,
        #fff 40px,
        transparent 40px,
        transparent 80px
    );
    animation: roadMove 2s linear infinite;
}

@keyframes roadMove {
    0% { top: -100%; }
    100% { top: 0; }
}

/* Player car styling */
.player-car {
    position: absolute;
    width: 40px;
    height: 70px;
    bottom: 20px;
    left: 130px;
    z-index: 10;
    transition: transform 0.1s;
}

.car-body {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #3498db, #2980b9);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.7);
}

.car-top {
    position: absolute;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #2980b9, #1a5276);
    top: 5px;
    left: 5px;
    border-radius: 3px;
}

.car-window {
    position: absolute;
    width: 20px;
    height: 15px;
    background: #a5d8ff;
    top: 8px;
    left: 10px;
    border-radius: 2px;
}

.car-light {
    position: absolute;
    width: 5px;
    height: 10px;
    background-color: #fff;
    top: 5px;
    border-radius: 2px;
}

.car-light.left { left: 3px; }
.car-light.right { right: 3px; }

.car-wheel {
    position: absolute;
    width: 12px;
    height: 6px;
    background: #222;
    border-radius: 3px;
}

.car-wheel.front-left { bottom: 0; left: 2px; }
.car-wheel.front-right { bottom: 0; right: 2px; }
.car-wheel.rear-left { top: 45px; left: 2px; }
.car-wheel.rear-right { top: 45px; right: 2px; }

/* Opponent car styling */
.opponent-car {
    position: absolute;
    width: 40px;
    height: 70px;
    z-index: 5;
}

.opponent-body {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.7);
}

.score, .high-score {
    position: absolute;
    color: white;
    font-size: 16px;
    z-index: 20;
    text-shadow: 1px 1px 2px black;
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
}

.score {
    top: 10px;
    left: 10px;
}

.high-score {
    top: 10px;
    right: 10px;
}

.countdown {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 60px;
    font-family: 'Racing Sans One', cursive;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    z-index: 30;
    display: none;
}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 24px;
    text-align: center;
    display: none;
    z-index: 30;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    border: 2px solid #e74c3c;
}

.game-over h2 {
    color: #e74c3c;
    margin-bottom: 15px;
    font-family: 'Racing Sans One', cursive;
}

.game-over p {
    margin: 10px 0;
}

.final-score {
    color: #f1c40f;
    font-weight: bold;
}

.restart-key {
    display: inline-block;
    background: #f1c40f;
    color: #000;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 3px;
    font-weight: bold;
}

.controls {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
}

.control-btn {
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid #3498db;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

/* Animation for when player moves */
.move-left {
    transform: rotate(-5deg);
}

.move-right {
    transform: rotate(5deg);
}

/* Countdown animations */
@keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.countdown.pulse {
    animation: pulse 0.5s ease-out;
        }
