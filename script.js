const playerOne = Player("Sr. X", "x");
const playerTwo = Player("Sr. O", "o");

const roundDelay = 1000;
const defaultMsg = "It's Sr. X turn";

const gameboard = (function () {
    let display = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    const addSymbol = function (player, position) {
        let col = position.col;
        let row = position.row;
        if (display[col][row] !== "x" && display[col][row] !== "o") {
            display[col][row] = player.symbol;
            displayController.displaySymbol(player.symbol, position);
        }
    };

    const resetDisplay = () =>
    (display = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]);
    const getDisplay = () => display;

    return { addSymbol, getDisplay, resetDisplay };
})();

const gameLogicController = (function () {
    let clickDisabled = false;
    const disableClick = () => (clickDisabled = true);
    const enableClick = () => (clickDisabled = false);

    const getClickDisabled = () => clickDisabled;

    const resetScore = function () {
        playerOne.setScore(0);
        playerTwo.setScore(0);
        displayController.displayScore();
    };
    let currentPlayer = playerTwo;
    const changeTurn = function () {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        } else {
            currentPlayer = playerOne;
        }
    };

    const setCurrentPlayer = (player) => (currentPlayer = player);
    const getCurrentPlayer = () => currentPlayer;

    const getWinner = function () {
        let display = gameboard.getDisplay();
        const name = currentPlayer.name;
        const symbol = currentPlayer.symbol;
        let won = false;
        let tie = false;

        /* for the player to win diagonalCount has to be 3 */
        let diagonalCount = 0;
        let reverseDiagonalCount = 0;
        let filledColumnsCount = 0;

        //check each column for win conditions
        for (let i = 0; i < display.length; i++) {
            //if the symbol is the same on one column
            if (display[i].every((val) => val === symbol)) {
                won = true;
                break;
            }
            //if the first element of each columns appears three times in a row
            if (display.filter((column) => column[i] === symbol).length === 3) {
                won = true;
                break;
            }
            if (display[i][i] === symbol) {
                diagonalCount++;
            }
            if (display[2 - i][i] === symbol) {
                reverseDiagonalCount++;
            }
            if (display[i].every((val) => val !== 0)) {
                filledColumnsCount++;
            }
        }

        if (diagonalCount === 3 || reverseDiagonalCount === 3) {
            won = true;
        }

        if (filledColumnsCount === 3) {
            tie = true;
        }
        if (won || tie) {
            if (won) {
                currentPlayer.addScore();
            }

            gameLogicController.disableClick();
            displayController.displayScore();
            displayController.displayWinMsg(currentPlayer.name, tie);
            setCurrentPlayer(playerTwo);

            setTimeout(() => displayController.clearDisplay(), roundDelay);
            setTimeout(() => gameLogicController.enableClick(), roundDelay);

            gameboard.resetDisplay();

            return { name, symbol, won };
        } else {
            return 0;
        }
    };

    return {
        changeTurn,
        getCurrentPlayer,
        getWinner,
        setCurrentPlayer,
        disableClick,
        getClickDisabled,
        enableClick,
        resetScore,
    };
})();

const setGameEvents = (function () {
    const squares = document.querySelectorAll(".square");
    squares.forEach(function (element) {
        element.addEventListener("click", function () {
            if (!element.firstChild && !gameLogicController.getClickDisabled()) {
                play(element);
            }
        });
    });
    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", function () {
        gameLogicController.resetScore();
        gameboard.resetDisplay();
        displayController.setMsg(defaultMsg);
        displayController.clearDisplay();
    });
})();

function Player(playerName, playerSymbol) {
    const name = playerName;
    const symbol = playerSymbol;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    const setScore = (value) => (score = value);
    return { name, symbol, getScore, addScore, setScore };
}

function getPosition(element) {
    return { col: element.getAttribute("col"), row: element.getAttribute("row") };
}

const displayController = (function () {
    const winMsg = document.querySelector(".win-msg");
    winMsg.textContent = defaultMsg;

    const displaySymbol = function (symbol, position) {
        let clickedSquare = document.querySelector(
            `div[col="${position.col}"][row="${position.row}"]`
        );
        let niceSymbol = document.createElement("div");
        niceSymbol.classList.add(`${symbol}-symbol`);
        clickedSquare.appendChild(niceSymbol);
    };

    const displayScore = function () {
        const playerOneScore = document.querySelector(".score.player-one");
        const playerTwoScore = document.querySelector(".score.player-two");

        playerOneScore.textContent = `${playerOne.name}: ${playerOne.getScore()}`;
        playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.getScore()}`;
    };

    const setMsg = function (msg) {
        winMsg.textContent = msg;
    };

    const displayWinMsg = function (winnerName, tie) {
        if (tie) {
            winMsg.textContent = `It's a tie`;
        } else {
            winMsg.textContent = `${winnerName} won`;
        }
        setTimeout(() => setMsg(defaultMsg), roundDelay);
    };

    const clearDisplay = function () {
        gameLogicController.setCurrentPlayer(playerTwo);
        let symbols = document.querySelectorAll(".square>div");
        symbols.forEach((square) => square.remove());
    };

    return { displaySymbol, clearDisplay, displayScore, displayWinMsg, setMsg };
})();

displayController.displayScore();

function play(element) {
    let player = gameLogicController.getCurrentPlayer();
    displayController.setMsg(`It's Sr. ${player.symbol.toUpperCase()} turn`);

    gameLogicController.changeTurn();

    player = gameLogicController.getCurrentPlayer();
    let position = getPosition(element);

    gameboard.addSymbol(player, position);
    gameLogicController.getWinner();
    console.log(gameboard.getDisplay());
}
