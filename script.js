
const playerOne = Player("user1", "x");
const playerTwo = Player("user2", "o");





const gameboard = (function() {
    let display = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const addSymbol = function(player, position) {
        let col = position.col;
        let row = position.row;
        if (display[col][row] !== "x" && display[col][row] !== "o") {
            display[col][row] = player.symbol;
            displayController.displaySymbol(player.symbol, position);
        }
    }

    const resetDisplay = () => display = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const getDisplay = () => display;
    return { addSymbol, getDisplay, resetDisplay };
})();

const gameLogicController = (function() {
    let currentPlayer = null;
    const changeTurn = function() {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;

        } else {
            currentPlayer = playerOne;
        } 
    }
    const getCurrentPlayer = () => currentPlayer;

    const getWinner = function () {
        let display = gameboard.getDisplay();
        const name = currentPlayer.name;
        const symbol = currentPlayer.symbol;
        let won = false;

        /* for the player to win diagonalCount has to be 3 */
        let diagonalCount = 0;
        let reverseDiagonalCount = 0;

        //check each column
        for (let i = 0; i < display.length; i++) {
            
            //if the symbol is the same on one column
            if (display[i].every(val => val === symbol)) {
                won = true;
                break;
            }

            if (display.filter(column => column[i] === symbol).length === 3) {
                won = true;
                console.log(display.filter(column => column[i] === symbol));
                break;
            }

            if (display[i][i] === symbol) {
                diagonalCount++;
            } 
            if (display[2 - i][i] === symbol) {
                reverseDiagonalCount++;
            }
        }

        if (diagonalCount === 3 || reverseDiagonalCount === 3) {
            won = true;
            
        }

        if (won) {
            currentPlayer.addScore();   
            console.log(`${currentPlayer.symbol} won, Score: ${currentPlayer.getScore()}`);
            return { name, symbol, won };
            
        } else {
            return 0;
        }
    }

    /* add tie function here */
    
    return { changeTurn, getCurrentPlayer, getWinner }
})();

const setGameEvents = (function() {
    const squares = document.querySelectorAll(".square");
    squares.forEach(function(element) {
        element.addEventListener("click", function() {
            if (!element.firstChild) {
                play(element);
            }
            
        })
    })
    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", function() {
        gameboard.resetDisplay();
        displayController.clearDisplay();
    })

})();

function Player(playerName, playerSymbol) {
    const name = playerName;
    const symbol = playerSymbol;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    return { name, symbol, getScore, addScore }
}

function getPosition (element) {
    return {col: element.getAttribute("col"), row: element.getAttribute("row")};
}

const displayController = (function() {
    const displaySymbol = function(symbol, position) {
        let clickedSquare = document.querySelector(`div[col="${position.col}"][row="${position.row}"]`);
        let niceSymbol = document.createElement("div");
        niceSymbol.classList.add(`${symbol}-symbol`);
        clickedSquare.appendChild(niceSymbol);
    }
    const clearDisplay = function() {
        let symbols = document.querySelectorAll(".square>div");
        symbols.forEach(square => square.remove());
    }
    const displayScore = function() {
        const playerOneScore = document.querySelector(".score.player-one");
        const playerTwoScore = document.querySelector(".score.player-two");

        playerOneScore.textContent = `${playerOne.name}: ${playerOne.getScore()}`;
        playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.getScore()}`;
    }


    return { displaySymbol, clearDisplay, displayScore };
})();

displayController.displayScore();

function play(element) {
    gameLogicController.changeTurn();
    let player = gameLogicController.getCurrentPlayer();
    let position = getPosition(element);
    let display = gameboard.getDisplay();
    gameboard.addSymbol(player, position);
    console.log(display);
    let winner = gameLogicController.getWinner();
    displayController.displayScore();
    
    
    
    
    


}











