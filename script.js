
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

// Show selected screen
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}

// PAGE 1: Start game
startBtn.addEventListener("click", () => {
    gameOver = false;
    showScreen(challengeScreen);
    resetNoButton();
});

// Move NO button to a random position
function moveNoButton() {

    if (gameOver) return;

    const areaWidth = buttonArea.clientWidth;
    const areaHeight = buttonArea.clientHeight;

    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const maxX = Math.max(0, areaWidth - btnWidth);
    const maxY = Math.max(0, areaHeight - btnHeight);

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.transform = "none";
}

// Reset NO button position
function resetNoButton() {
    noBtn.style.left = "8%";
    noBtn.style.top = "50%";
    noBtn.style.transform = "translateY(-50%)";
}

// PAGE 2: Make NO escape
noBtn.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
        moveNoButton();
    }
});

// Also escape when someone touches it
noBtn.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") {
        // A small lucky chance to catch NO!
        if (Math.random() < 0.03) return;

        event.preventDefault();
        moveNoButton();
    }
});

// Desktop: Escape when the cursor gets close
buttonArea.addEventListener("pointermove", (event) => {

    if (gameOver || event.pointerType !== "mouse") return;

    const buttonRect = noBtn.getBoundingClientRect();

    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
    );

    if (distance < 65 && Date.now() - lastEscape > 100) {
        lastEscape = Date.now();

        if (Math.random() < 0.03) return;

        moveNoButton();
    }
});

// If someone successfully clicks NO
noBtn.addEventListener("click", () => {

    if (gameOver) return;

    gameOver = true;
    showScreen(winScreen);

});

// YES means they give up
yesBtn.addEventListener("click", () => {

    if (gameOver) return;

    gameOver = true;
    showScreen(loseScreen);

});

// Play again for the next customer
function restartGame() {

    gameOver = false;
    lastEscape = 0;

    resetNoButton();

    showScreen(welcomeScreen);
}
