var app = {
    gamestate: [0, 0, 0, 0, 0, 0, 0, 0],
    players: null,
    playerOnePiece: null,
    playerTwoPiece: null,
    lastCell: null,
    turn: null,
    playerOneScore: 0,
    playerTwoScore: 0,
    nextPiece: null,
    difficulty: null
}

function playersSelect(selectedPlayers) {
    app.players = selectedPlayers;
    var pieceSelectMessage = document.getElementById("pieceSelectMessage");
    if (selectedPlayers === 1) {
        pieceSelectMessage.textContent = "Choose your piece:";
    } else {
        pieceSelectMessage.textContent = "Player 1: choose your piece:";
    }
    toggleVisibility("playersSelect");
    setTimeout(function() {
        toggleVisibility("pieceSelect");
    }, 500)
}

function pieceSelect(selectedPiece) {
    app.playerOnePiece = selectedPiece;
    if (app.playerOnePiece === 1) {
        app.playerTwoPiece = 2;
    } else {
        app.playerTwoPiece = 1;
    }
    toggleVisibility("pieceSelect");
    if (app.players === 1) {
        setTimeout(function() {
           toggleVisibility("difficultySelect"); 
        }, 500);
    } else {
        reset();
        app.playerOneScore = 0;
        app.playerTwoScore = 0;
        displayScoreboard();
        setFirstTurn();
    }
}

function difficultySelect(difficulty) {
    app.difficulty = difficulty;
    toggleVisibility("difficultySelect");
    reset();
    app.playerOneScore = 0;
    app.playerTwoScore = 0;
    displayScoreboard();
    setFirstTurn();
    
}

function toggleVisibility(elementID) {
    var element = document.getElementById(elementID);
    if (window.getComputedStyle(element).visibility === "visible") {
        document.getElementById(elementID).style.opacity = "0";
        setTimeout(function() {
            document.getElementById(elementID).style.visibility = "hidden";
        }, 500);
    } else {
        document.getElementById(elementID).style.opacity = "0.8";
        document.getElementById(elementID).style.visibility = "visible";
    }
}

function reset() {
    app.gamestate = [0, 0, 0, 0, 0, 0 , 0, 0 , 0];
    displayGamestate();
}

function displayScoreboard() {
    if (app.players === 2) {
        document.getElementById("playerOneScoreText").textContent = "Player 1";
        document.getElementById("playerTwoScoreText").textContent = "Player 2";
    } else {
        document.getElementById("playerOneScoreText").textContent = "You";
        document.getElementById("playerTwoScoreText").textContent = "Computer";
    }
    document.getElementById("playerOneWins").textContent = "0";
    document.getElementById("playerTwoWins").textContent = "0";
    if (document.getElementById("scoreboard").style.visibility = "hidden") {
        toggleVisibility("scoreboard");
    }
}

function setFirstTurn() {
    if (app.playerOnePiece === 1) {
        app.turn = "playerOne";
        app.nextPiece = 1;
        document.getElementById("playerTwoScore").style.fontWeight = "normal";
        document.getElementById("playerOneScore").style.fontWeight = "bold";
    } else if (app.playerTwoPiece === 1) {
        app.turn = "playerTwo";
        app.nextPiece = 1;
        document.getElementById("playerOneScore").style.fontWeight = "normal";
        document.getElementById("playerTwoScore").style.fontWeight = "bold";
    } else {
        app.turn = "computer";
    }
}

function showGhostPiece(cellID) {
    var cell = document.getElementById(cellID);
    if (cell.textContent === "" && app.turn !== null && app.turn !== "computer") {
        if (app.nextPiece === 1) {
            cell.classList.add("xGhost");
        } else {
            cell.classList.add("oGhost");
        }
    }
}

function hideGhostPiece(cellID) {
    document.getElementById(cellID).classList.remove("xGhost");
    document.getElementById(cellID).classList.remove("oGhost");
}

function playerTurn(cellID) {
    if (app.gamestate[cellID] === 0 && app.turn !== null) {
        if (app.turn === "playerOne") { 
            app.gamestate[cellID] = app.playerOnePiece;
            app.nextPiece = app.playerTwoPiece;
            if (app.players === 2) {
                app.turn = "playerTwo";
                document.getElementById("playerOneScore").style.fontWeight = "normal";
                document.getElementById("playerTwoScore").style.fontWeight = "bold";
            } else {
                app.turn = "computer";
                document.getElementById("playerOneScore").style.fontWeight = "normal";
                document.getElementById("playerTwoScore").style.fontWeight = "bold";
                computerTurn();
            }
        } else if (app.turn === "playerTwo") {
            app.gamestate[cellID] = app.playerTwoPiece;
            app.nextPiece = app.playerOnePiece;
            app.turn = "playerOne";
            document.getElementById("playerTwoScore").style.fontWeight = "normal";
            document.getElementById("playerOneScore").style.fontWeight = "bold";
        }
        displayGamestate();
        app.lastCell = cellID;
        hideGhostPiece(cellID);
        var winningPiece;
        if (winningPiece = checkForWinner()) {
            declareWinner(winningPiece);
        }
    }
}

function computerTurn() {
    setTimeout(function() {
        if (app.turn === "computer") { // Prevents computer taking another move if player wins, as declareWinner will set app.turn = null.
            if (app.difficulty === "easy") {
                randomMove();
            } else if (app.difficulty === "medium") {
                mediumComputerTurn();
            }
        }
    }, 500);
}

function mediumComputerTurn() {
    // Win if possible.
    var availableCells = [];
    for (var i = 0; i < app.gamestate.length; i++) {
        if (app.gamestate[i] === 0) {
            availableCells.push(i);
        }
    }
    for (i = 0; i < availableCells.length; i++) { // For each available cell, check if moving there would win. Remove the piece if it doesn't win.
        app.gamestate[availableCells[i]] = app.playerTwoPiece;
        app.lastCell = availableCells[i].toString();
        var winningPiece;
        if (winningPiece = checkForWinner()) {
            app.nextPiece = app.playerOnePiece;
            app.turn = "playerOne";
            displayGamestate();
            declareWinner(winningPiece);
            return;
        } else {
            app.gamestate[availableCells[i]] = 0;
        }
    }
    // Block if possible.
    for (i = 0; i < availableCells.length; i++) { // For each available cell, check if the player could move there and block it. Remove the piece if it doesn't block.
        app.gamestate[availableCells[i]] = app.playerOnePiece;
        app.lastCell = availableCells[i].toString();
        var winningPiece;
        if (winningPiece = checkForWinner()) {
            app.gamestate[availableCells[i]] = app.playerTwoPiece;
            app.nextPiece = app.playerOnePiece;
            app.turn = "playerOne";
            displayGamestate();
            return;
        } else {
            app.gamestate[availableCells[i]] = 0;
        }
    }
    // Random move if no wins or blocks are available.
    randomMove(availableCells);
}

function randomMove(availableCells) {
    if (!availableCells) {
        var availableCells = [];
        for (var i = 0; i < app.gamestate.length; i++) {
            if (app.gamestate[i] === 0) {
                availableCells.push(i);
            }
        }
    }
    var randomCell = Math.floor(Math.random() * availableCells.length);
    app.gamestate[availableCells[randomCell]] = app.playerTwoPiece;
    app.nextPiece = app.playerOnePiece;
    app.lastCell = availableCells[randomCell].toString();
    app.turn = "playerOne";
    displayGamestate();
    var winningPiece;
    if (winningPiece = checkForWinner()) {
        declareWinner(winningPiece);
    }
}

function displayGamestate() {
    for (var i = 0; i < 9; i++) {
        if (app.gamestate[i] === 0) {
            document.getElementById(i).textContent = "";
        } else if (app.gamestate[i] === 1) {
            document.getElementById(i).textContent = "X";
        } else if (app.gamestate[i] === 2) {
            document.getElementById(i).textContent = "O";
        }
    }
}

function declareWinner(winningPiece) {
    app.turn = null;
    var gameOverMessage = document.getElementById("gameOverMessage");
    if (winningPiece === 0) {
        gameOverMessage.textContent = "Draw!";
    } else if (app.players === 1) {
        if (app.playerOnePiece === winningPiece) {
            gameOverMessage.textContent = "You win!";
            app.playerOneScore++;
        } else {
            gameOverMessage.textContent = "You lose :(";
            app.playerTwoScore++;
        }
    } else if (app.playerOnePiece === winningPiece) {
        gameOverMessage.textContent = "Player 1 wins!";
        app.playerOneScore++;
    } else {
        gameOverMessage.textContent = "Player 2 wins!"
        app.playerTwoScore++;
    }
    toggleVisibility("gameOver");
    setTimeout(function() {
        toggleVisibility("gameOver");
        reset();
        setFirstTurn();
    }, 1500)
    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById("playerOneWins").textContent = app.playerOneScore;
    document.getElementById("playerTwoWins").textContent = app.playerTwoScore;
}

function checkForWinner() {
    var samePiece = app.gamestate[app.lastCell];
    switch (app.lastCell) {
        // Top left
        case "0":
            // Horizontal
            if (app.gamestate[0] === samePiece &&
                app.gamestate[1] === samePiece &&
                app.gamestate[2] === samePiece) {
            return samePiece;
            }
            // Diagonal
            if (app.gamestate[0] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[0] === samePiece &&
                app.gamestate[3] === samePiece &&
                app.gamestate[6] === samePiece) {
            return samePiece;
            }
        break;
        // Top middle
        case "1":
            // Horizontal 
            if (app.gamestate[0] === samePiece &&
                app.gamestate[1] === samePiece &&
                app.gamestate[2] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[1] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[7] === samePiece) {
            return samePiece;
            }
        break;
        // Top right
        case "2":
            // Horizontal
            if (app.gamestate[0] === samePiece &&
                app.gamestate[1] === samePiece &&
                app.gamestate[2] === samePiece) {
            return samePiece;
            }
            // Diagonal
            if (app.gamestate[2] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[6] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[2] === samePiece &&
                app.gamestate[5] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
        break;
        // Middle left
        case "3":
            // Horizontal
            if (app.gamestate[3] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[5] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[2] === samePiece &&
                app.gamestate[5] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
        break;
        // Middle middle
        case "4":
            // Horizontal
            if (app.gamestate[3] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[5] === samePiece) {
            return samePiece;
            }
            // Diagonal \
            if (app.gamestate[0] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Diagonal /
            if (app.gamestate[2] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[6] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[1] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[7] === samePiece) {
            return samePiece;
            }
        break;
        // Middle right
        case "5":
            // Horizontal
            if (app.gamestate[3] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[5] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[2] === samePiece &&
                app.gamestate[5] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
        break;
        // Bottom left
        case "6":
            // Horizontal
            if (app.gamestate[6] === samePiece &&
                app.gamestate[7] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Diagonal
            if (app.gamestate[2] === 1 &&
                app.gamestate[4] === 1 &&
                app.gamestate[6] === 1) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[0] === samePiece &&
                app.gamestate[3] === samePiece &&
                app.gamestate[6] === samePiece) {
            return samePiece;
            }
        break;
        // Bottom middle
        case "7":
            // Horizontal
            if (app.gamestate[6] === samePiece &&
                app.gamestate[7] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[1] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[7] === samePiece) {
            return samePiece;
            }
        break;
        // Bottom right
        case "8":
            // Horizontal
            if (app.gamestate[6] === samePiece &&
                app.gamestate[7] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Diagonal
            if (app.gamestate[0] === samePiece &&
                app.gamestate[4] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
            // Vertical
            if (app.gamestate[2] === samePiece &&
                app.gamestate[5] === samePiece &&
                app.gamestate[8] === samePiece) {
            return samePiece;
            }
        break;
    }
    for (var i = 0; i < app.gamestate.length; i++) {
        if (app.gamestate[i] === 0) {
            break;
        } else if (i === app.gamestate.length - 1) {
            declareWinner(0); // Draw
        }
    }
    return null;
}
