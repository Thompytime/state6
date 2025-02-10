const states = [
    // England Counties
    { name: "Bedfordshire", country: "England" },
];

let currentState;
let correctGuesses = [];
let incorrectGuesses = 0;
let gameStatus = '';
const maxIncorrectGuesses = 5;

function initGame() {
    const today = new Date();
    const gameIndex = today.getDate() % states.length;
    currentState = states[gameIndex];

    // Check if there's saved game data in localStorage
    const savedGame = localStorage.getItem("gameData");
    if (savedGame) {
        const gameData = JSON.parse(savedGame);
        if (gameData.date === today.toDateString()) {
            correctGuesses = gameData.correctGuesses;
            incorrectGuesses = gameData.incorrectGuesses;
            gameStatus = gameData.gameStatus;
        } else {
            resetGame();
        }
    } else {
        resetGame();
    }

    // Set the image dynamically based on the current state
    const imageContainer = document.getElementById('image-container');
    const imagePath = `images/${currentState.name}.png`;
    imageContainer.innerHTML = `<img src="${imagePath}" alt="${currentState.name}" style="max-width: 100%; height: auto;">`;

    renderGame();
}

function resetGame() {
    correctGuesses = Array(currentState.name.length).fill('_');
    incorrectGuesses = 0;
    gameStatus = '';
    saveGame(); // Save new game state
}

function handleGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.trim().toLowerCase();
    guessInput.value = '';

    if (guess && guess.length > 0) {
        const stateName = currentState.name.toLowerCase();
        let correctGuess = false;

        if (guess === stateName) {
            correctGuesses = currentState.name.split('');
            gameStatus = 'You guessed it right!';
            document.getElementById('reload-btn').style.display = 'block';
            document.getElementById('submit-btn').disabled = true;
            saveGame();
            renderGame();
            return;
        }

        for (let i = 0; i < stateName.length; i++) {
            if (guess.includes(stateName[i])) {
                correctGuesses[i] = currentState.name[i];
                correctGuess = true;
            }
        }

        if (!correctGuess || guess !== stateName) {
            incorrectGuesses++;
            gameStatus = 'Incorrect guess!';

            if (incorrectGuesses >= maxIncorrectGuesses) {
                gameStatus = `Game over! The correct answer was: ${currentState.name}`;
                document.getElementById('reload-btn').style.display = 'block';
                document.getElementById('submit-btn').disabled = true;
            }
        }

        saveGame();
        renderGame();
    }
}

function saveGame() {
    const gameData = {
        date: new Date().toDateString(),
        correctGuesses,
        incorrectGuesses,
        gameStatus,
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
}

function renderGame() {
    document.getElementById('word-container').innerText = correctGuesses.join(' ');
    document.getElementById('incorrect-guesses').innerText = `Incorrect Guesses: ${incorrectGuesses}/${maxIncorrectGuesses}`;
    document.getElementById('game-status').innerText = gameStatus;
}

document.getElementById('submit-btn').addEventListener('click', handleGuess);
document.getElementById('reload-btn').addEventListener('click', () => {
    localStorage.removeItem("gameData"); // Clear saved game
    initGame();
});

window.onload = initGame;
