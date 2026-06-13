let playerScore = 0;
let computerScore = 0;

let gameMode = "single";

let currentPlayer = 1;
let player1Choice = "";

// SOUNDS
const clickSound = new Audio("click.wav");
const winSound = new Audio("win.wav");
const loseSound = new Audio("lose.wav");

function setMode(mode){

    gameMode = mode;

    resetGame();

    if(mode === "single"){

        document.getElementById("player1-name").innerText = "YOU";
        document.getElementById("player2-name").innerText = "ROBOT";

        document.getElementById("left-label").innerText = "Your Hero";
        document.getElementById("right-label").innerText = "Robot Enemy";

    }else{

        document.getElementById("player1-name").innerText = "PLAYER 1";
        document.getElementById("player2-name").innerText = "PLAYER 2";

        document.getElementById("left-label").innerText = "Player 1";
        document.getElementById("right-label").innerText = "Player 2";
    }
}

function playGame(playerChoice){

    clickSound.play();

    const playerDisplay =
        document.getElementById("player-choice-display");

    const computerDisplay =
        document.getElementById("computer-choice-display");

    const resultText =
        document.getElementById("result-text");

    // SINGLE PLAYER MODE
    if(gameMode === "single"){

        const choices = ["rock", "paper", "scissors"];

        const computerChoice =
            choices[Math.floor(Math.random() * 3)];

        playerDisplay.innerHTML = getEmoji(playerChoice);

        computerDisplay.innerHTML =
            getEmoji(computerChoice);

        checkWinner(playerChoice, computerChoice);

    }

    // MULTIPLAYER MODE
    else{

        if(currentPlayer === 1){

            player1Choice = playerChoice;

            playerDisplay.innerHTML =
                getEmoji(playerChoice);

            resultText.innerText =
                "PLAYER 2 TURN";

            currentPlayer = 2;

            return;
        }

        const player2Choice = playerChoice;

        computerDisplay.innerHTML =
            getEmoji(player2Choice);

        checkWinner(player1Choice, player2Choice);

        currentPlayer = 1;
    }
}

function checkWinner(choice1, choice2){

    const resultText =
        document.getElementById("result-text");

    if(choice1 === choice2){

        resultText.innerText =
            "IT'S A TIE 🤝";

        resultText.className =
            "result-banner tie";

        return;
    }

    const playerWins =

        (choice1 === "rock" && choice2 === "scissors") ||

        (choice1 === "paper" && choice2 === "rock") ||

        (choice1 === "scissors" && choice2 === "paper");

    if(playerWins){

        playerScore++;

        document.getElementById("player-score")
            .innerText = playerScore;

        resultText.innerText =
            "🏆 PLAYER 1 WINS ROUND";

        resultText.className =
            "result-banner win";

        winSound.play();

    }else{

        computerScore++;

        document.getElementById("computer-score")
            .innerText = computerScore;

        resultText.innerText =
            gameMode === "single"
            ? "🤖 ROBOT WINS ROUND"
            : "🏆 PLAYER 2 WINS ROUND";

        resultText.className =
            "result-banner lose";

        loseSound.play();
    }

    // MATCH OVER
    if(playerScore === 11 || computerScore === 11){

        setTimeout(() => {

            if(playerScore > computerScore){

                alert("🏆 PLAYER 1 WON THE MATCH!");

            }else{

                alert(
                    gameMode === "single"
                    ? "🤖 ROBOT WON THE MATCH!"
                    : "🏆 PLAYER 2 WON THE MATCH!"
                );
            }

            resetGame();

        }, 300);
    }
}

function resetGame(){

    playerScore = 0;
    computerScore = 0;

    currentPlayer = 1;

    player1Choice = "";

    document.getElementById("player-score")
        .innerText = "0";

    document.getElementById("computer-score")
        .innerText = "0";

    document.getElementById("player-choice-display")
        .innerHTML = "❓";

    document.getElementById("computer-choice-display")
        .innerHTML = "❓";

    document.getElementById("result-text")
        .innerText = "Pick your move!";

    document.getElementById("result-text")
        .className = "result-banner";
}

function getEmoji(choice){

    if(choice === "rock"){
        return "✊";
    }

    if(choice === "paper"){
        return "🖐️";
    }

    return "✌️";
}
