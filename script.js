
const welcomeScreen = document.getElementById("welcome-screen");
const challengeScreen = document.getElementById("challenge-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const buttonArea = document.getElementById("button-area");

let gameOver = false;
let lastEscape = 0;

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}

startBtn.addEventListener("click", () => {
    gameOver = false;
    showScreen(challengeScreen);
    resetNoButton();
});

function resetNoButton() {
    noBtn.style.left = "8%";
    noBtn.style.top = "50%";
    noBtn.style.transform = "translateY(-50%)";
}

function moveNoButton() {
    if (gameOver) return;

    const maxX = buttonArea.clientWidth - noBtn.offsetWidth;
    const maxY = buttonArea.clientHeight - noBtn.offsetHeight;

    const randomX = Math.random() * Math.max(0, maxX);
    const randomY = Math.random() * Math.max(0, maxY);

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.transform = "none";
}

// Check whether pointer is close to NO
function isNearNo(x, y) {
    const rect = noBtn.getBoundingClientRect();

    const margin = 100;

    return (
        x >= rect.left - margin &&
        x <= rect.right + margin &&
        y >= rect.top - margin &&
        y <= rect.bottom + margin
    );
}

// Desktop: Escape before mouse reaches NO
buttonArea.addEventListener("pointermove", (event) => {
    if (gameOver || event.pointerType !== "mouse") return;

    if (
        isNearNo(event.clientX, event.clientY) &&
        Date.now() - lastEscape > 100
    ) {
        lastEscape = Date.now();
        moveNoButton();
    }
});

// Mobile and desktop: Detect touch/click near NO
buttonArea.addEventListener("pointerdown", (event) => {
    if (gameOver) return;

    if (isNearNo(event.clientX, event.clientY)) {
        event.preventDefault();
        moveNoButton();
    }
});

// Extra protection against any accidental NO click
noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    moveNoButton();
});

// YES means lose
yesBtn.addEventListener("click", () => {
    if (gameOver) return;

    gameOver = true;
    showScreen(loseScreen);
});

// Restart
function restartGame() {
    gameOver = false;
    lastEscape = 0;

    resetNoButton();
    showScreen(welcomeScreen);
}
