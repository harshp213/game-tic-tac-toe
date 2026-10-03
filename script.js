// =============================
// DOM ELEMENTS
// =============================

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const pvpBtn =
    document.getElementById("pvpBtn");

const computerBtn =
    document.getElementById("computerBtn");

const difficultySection =
    document.getElementById("difficultySection");

const difficultySelect =
    document.getElementById("difficulty");

const currentRoundText =
    document.getElementById("currentRound");

const playerX =
    document.getElementById("playerX");

const playerO =
    document.getElementById("playerO");

const playerOName =
    document.getElementById("playerOName");

const xScore =
    document.getElementById("xScore");

const oScore =
    document.getElementById("oScore");

const xScoreBoard =
    document.getElementById("xScoreBoard");

const oScoreBoard =
    document.getElementById("oScoreBoard");

const drawScore =
    document.getElementById("drawScore");

const restartBtn =
    document.getElementById("restartBtn");

const resetScoreBtn =
    document.getElementById("resetScoreBtn");


// =============================
// POPUPS
// =============================

const startPopup =
    document.getElementById("startPopup");

const startGameBtn =
    document.getElementById("startGameBtn");

const specialPopup =
    document.getElementById("specialPopup");

const startSpecialBtn =
    document.getElementById("startSpecialBtn");

const matchPopup =
    document.getElementById("matchPopup");

const matchIcon =
    document.getElementById("matchIcon");

const matchTitle =
    document.getElementById("matchTitle");

const matchMessage =
    document.getElementById("matchMessage");

const finalXScore =
    document.getElementById("finalXScore");

const finalOScore =
    document.getElementById("finalOScore");

const finalOName =
    document.getElementById("finalOName");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// =============================
// GAME VARIABLES
// =============================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "pvp";

let difficulty = "easy";

let currentRound = 1;

const totalRounds = 3;


// SPECIAL ROUND

let specialRound = false;


// MATCH SCORES

let scores = {

    X: 0,

    O: 0,

    draw: 0

};


// =============================
// WINNING CONDITIONS
// =============================

const winningConditions = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// =============================
// CELL CLICK
// =============================

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        () => {

            const index =
                Number(
                    cell.dataset.index
                );

            handleMove(index);

        }
    );

});


// =============================
// START GAME
// =============================

startGameBtn.addEventListener(
    "click",
    () => {

        startPopup.classList.add(
            "hidden"
        );

        resetMatch();

    }
);


// =============================
// HANDLE MOVE
// =============================

function handleMove(index) {

    if (!gameActive) {

        return;

    }


    if (board[index] !== "") {

        return;

    }


    // Prevent clicking during computer turn

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        return;

    }


    makeMove(
        index,
        currentPlayer
    );


    const result =
        checkGameResult();


    if (result) {

        return;

    }


    switchPlayer();


    // Computer move

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        setTimeout(
            computerMove,
            500
        );

    }

}


// =============================
// MAKE MOVE
// =============================

function makeMove(
    index,
    player
) {

    board[index] =
        player;

    cells[index].textContent =
        player;

    cells[index].classList.add(
        player.toLowerCase()
    );

}


// =============================
// SWITCH PLAYER
// =============================

function switchPlayer() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    updateStatus();

    updateActivePlayer();

}


// =============================
// UPDATE STATUS
// =============================

function updateStatus() {

    if (!gameActive) {

        return;

    }


    if (specialRound) {

        if (
            gameMode === "computer"
        ) {

            statusText.textContent =
                currentPlayer === "X"
                    ? "🔥 Final Decider - Your Turn!"
                    : "🔥 Final Decider - Computer's Turn!";

        }

        else {

            statusText.textContent =
                `🔥 Final Decider - Player ${currentPlayer}'s Turn`;

        }

        return;

    }


    if (
        gameMode === "computer"
    ) {

        statusText.textContent =
            currentPlayer === "X"
                ? "Your Turn (X)"
                : "Computer's Turn (O)";

    }

    else {

        statusText.textContent =
            `Player ${currentPlayer}'s Turn`;

    }

}


// =============================
// ACTIVE PLAYER
// =============================

function updateActivePlayer() {

    playerX.classList.remove(
        "active"
    );

    playerO.classList.remove(
        "active"
    );


    if (
        currentPlayer === "X"
    ) {

        playerX.classList.add(
            "active"
        );

    }

    else {

        playerO.classList.add(
            "active"
        );

    }

}


// =============================
// CHECK GAME RESULT
// =============================

function checkGameResult() {

    for (
        const condition
        of winningConditions
    ) {

        const [a, b, c] =
            condition;


        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            endRound(
                board[a],
                condition
            );

            return true;

        }

    }


    // DRAW

    if (
        !board.includes("")
    ) {

        endDraw();

        return true;

    }


    return false;

}


// =============================
// END ROUND
// =============================

function endRound(
    winner,
    winningCells
) {

    gameActive = false;


    // Highlight winning cells

    winningCells.forEach(
        index => {

            cells[index]
                .classList.add(
                    "winning-cell"
                );

        }
    );


    scores[winner]++;


    updateScoreboard();


    // SPECIAL ROUND RESULT

    if (specialRound) {

        setTimeout(
            () => {

                endSpecialRound(
                    winner
                );

            },
            1500
        );

        return;

    }


    statusText.textContent =
        `Player ${winner} wins Round ${currentRound}!`;


    setTimeout(
        finishRound,
        1500
    );

}


// =============================
// END DRAW
// =============================

function endDraw() {

    gameActive = false;

    scores.draw++;

    updateScoreboard();


    // Special Round draw

    if (specialRound) {

        statusText.textContent =
            "🔥 Special Round Draw!";

        setTimeout(
            restartSpecialRound,
            1500
        );

        return;

    }


    statusText.textContent =
        `Round ${currentRound} is a Draw!`;


    setTimeout(
        finishRound,
        1500
    );

}


// =============================
// FINISH NORMAL ROUND
// =============================

function finishRound() {

    if (
        currentRound === totalRounds
    ) {

        checkForSpecialRound();

        return;

    }


    currentRound++;


    currentRoundText.textContent =
        currentRound;


    restartRound();

}


// =============================
// CHECK SPECIAL ROUND
// =============================

function checkForSpecialRound() {

    if (
        scores.X === 1 &&
        scores.O === 1 &&
        scores.draw === 1
    ) {

        showSpecialRound();

    }

    else {

        endMatch();

    }

}


// =============================
// SHOW SPECIAL ROUND
// =============================

function showSpecialRound() {

    specialRound = true;

    gameActive = false;


    document.body.classList.add(
        "special-round-active"
    );


    specialPopup.classList.remove(
        "hidden"
    );

}


// =============================
// START SPECIAL ROUND BUTTON
// =============================

startSpecialBtn.addEventListener(
    "click",
    () => {

        specialPopup.classList.add(
            "hidden"
        );

        startSpecialRound();

    }
);


// =============================
// START SPECIAL ROUND
// =============================

function startSpecialRound() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(
        cell => {

            cell.textContent = "";

            cell.classList.remove(
                "x",
                "o",
                "winning-cell"
            );

        }
    );


    currentRoundText.textContent =
        "🔥";


    statusText.textContent =
        "🔥 FINAL DECIDER - Player X's Turn!";


    updateActivePlayer();

}


// =============================
// RESTART SPECIAL ROUND
// =============================

function restartSpecialRound() {

    startSpecialRound();

}


// =============================
// END SPECIAL ROUND
// =============================

function endSpecialRound(
    winner
) {

    specialRound = false;


    document.body.classList.remove(
        "special-round-active"
    );


    endMatch(winner);

}


// =============================
// RESTART NORMAL ROUND
// =============================

function restartRound() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(
        cell => {

            cell.textContent = "";

            cell.classList.remove(
                "x",
                "o",
                "winning-cell"
            );

        }
    );


    updateStatus();

    updateActivePlayer();

}


// =============================
// UPDATE SCOREBOARD
// =============================

function updateScoreboard() {

    xScore.textContent =
        scores.X;

    oScore.textContent =
        scores.O;


    xScoreBoard.textContent =
        scores.X;

    oScoreBoard.textContent =
        scores.O;

    drawScore.textContent =
        scores.draw;

}


// =============================
// END MATCH
// =============================

function endMatch(
    specialWinner = null
) {

    gameActive = false;


    let winner =
        specialWinner;


    // Normal match result

    if (!winner) {

        if (
            scores.X > scores.O
        ) {

            winner = "X";

        }

        else if (
            scores.O > scores.X
        ) {

            winner = "O";

        }

    }


    // X wins

    if (
        winner === "X"
    ) {

        matchIcon.textContent =
            "🏆";

        matchTitle.textContent =
            "Player X Wins the Match!";

        matchMessage.textContent =
            specialWinner
                ? "Player X won the Special Round and became the champion!"
                : "Congratulations! Player X is the champion!";

    }


    // O wins

    else if (
        winner === "O"
    ) {

        matchIcon.textContent =
            "🏆";


        matchTitle.textContent =
            gameMode === "computer"
                ? "Computer Wins the Match!"
                : "Player O Wins the Match!";


        matchMessage.textContent =
            specialWinner
                ? gameMode === "computer"
                    ? "The Computer won the Special Round!"
                    : "Player O won the Special Round!"
                : "Congratulations! We have a match winner!";

    }


    // Match draw

    else {

        matchIcon.textContent =
            "🤝";

        matchTitle.textContent =
            "Match Draw!";

        matchMessage.textContent =
            "Both players finished with equal scores.";

    }


    finalXScore.textContent =
        scores.X;

    finalOScore.textContent =
        scores.O;


    finalOName.textContent =
        gameMode === "computer"
            ? "Computer O"
            : "Player O";


    matchPopup.classList.remove(
        "hidden"
    );

}


// =============================
// PLAY AGAIN
// =============================

playAgainBtn.addEventListener(
    "click",
    () => {

        matchPopup.classList.add(
            "hidden"
        );


        document.body.classList.remove(
            "special-round-active"
        );


        resetMatch();

    }
);


// =============================
// RESET MATCH
// =============================

function resetMatch() {

    currentRound = 1;

    specialRound = false;


    scores = {

        X: 0,

        O: 0,

        draw: 0

    };


    currentRoundText.textContent =
        currentRound;


    document.body.classList.remove(
        "special-round-active"
    );


    updateScoreboard();

    restartRound();

}


// =============================
// RESTART ROUND BUTTON
// =============================

restartBtn.addEventListener(
    "click",
    () => {

        if (
            specialRound
        ) {

            startSpecialRound();

        }

        else {

            restartRound();

        }

    }
);


// =============================
// RESET MATCH BUTTON
// =============================

resetScoreBtn.addEventListener(
    "click",
    () => {

        resetMatch();

    }
);


// =============================
// PLAYER VS PLAYER
// =============================

pvpBtn.addEventListener(
    "click",
    () => {

        gameMode = "pvp";


        pvpBtn.classList.add(
            "active"
        );

        computerBtn.classList.remove(
            "active"
        );


        difficultySection.style.display =
            "none";


        playerOName.textContent =
            "Player O";


        resetMatch();

    }
);


// =============================
// COMPUTER MODE
// =============================

computerBtn.addEventListener(
    "click",
    () => {

        gameMode = "computer";


        computerBtn.classList.add(
            "active"
        );

        pvpBtn.classList.remove(
            "active"
        );


        difficultySection.style.display =
            "block";


        playerOName.textContent =
            "Computer O";


        resetMatch();

    }
);


// =============================
// DIFFICULTY
// =============================

difficultySelect.addEventListener(
    "change",
    () => {

        difficulty =
            difficultySelect.value;


        resetMatch();

    }
);


// =============================
// COMPUTER MOVE
// =============================

function computerMove() {

    if (!gameActive) {

        return;

    }


    let move;


    if (
        difficulty === "easy"
    ) {

        move =
            easyMove();

    }

    else if (
        difficulty === "medium"
    ) {

        move =
            mediumMove();

    }

    else {

        move =
            bestMove();

    }


    if (
        move !== null
    ) {

        makeMove(
            move,
            "O"
        );


        const result =
            checkGameResult();


        if (result) {

            return;

        }


        switchPlayer();

    }

}


// =============================
// EASY AI
// =============================

function easyMove() {

    const empty =
        board
            .map(
                (value, index) =>
                    value === ""
                        ? index
                        : null
            )
            .filter(
                index =>
                    index !== null
            );


    if (
        empty.length === 0
    ) {

        return null;

    }


    return empty[
        Math.floor(
            Math.random() *
            empty.length
        )
    ];

}


// =============================
// MEDIUM AI
// =============================

function mediumMove() {

    // Try to win

    for (
        const condition
        of winningConditions
    ) {

        const [a, b, c] =
            condition;


        if (
            board[a] === "O" &&
            board[b] === "O" &&
            board[c] === ""
        ) {

            return c;

        }


        if (
            board[a] === "O" &&
            board[c] === "O" &&
            board[b] === ""
        ) {

            return b;

        }


        if (
            board[b] === "O" &&
            board[c] === "O" &&
            board[a] === ""
        ) {

            return a;

        }

    }


    // Block X

    for (
        const condition
        of winningConditions
    ) {

        const [a, b, c] =
            condition;


        if (
            board[a] === "X" &&
            board[b] === "X" &&
            board[c] === ""
        ) {

            return c;

        }


        if (
            board[a] === "X" &&
            board[c] === "X" &&
            board[b] === ""
        ) {

            return b;

        }


        if (
            board[b] === "X" &&
            board[c] === "X" &&
            board[a] === ""
        ) {

            return a;

        }

    }


    // Center

    if (
        board[4] === ""
    ) {

        return 4;

    }


    // Corners

    const corners = [
        0,
        2,
        6,
        8
    ];


    const availableCorners =
        corners.filter(
            index =>
                board[index] === ""
        );


    if (
        availableCorners.length > 0
    ) {

        return availableCorners[
            Math.floor(
                Math.random() *
                availableCorners.length
            )
        ];

    }


    return easyMove();

}


// =============================
// HARD AI
// =============================

function bestMove() {

    let bestScore =
        -Infinity;

    let move = null;


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            board[i] === ""
        ) {

            board[i] = "O";


            const score =
                minimax(
                    board,
                    0,
                    false
                );


            board[i] = "";


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                move = i;

            }

        }

    }


    return move;

}


// =============================
// MINIMAX
// =============================

function minimax(
    currentBoard,
    depth,
    isMaximizing
) {

    const result =
        evaluateBoard(
            currentBoard
        );


    if (
        result !== null
    ) {

        return result;

    }


    if (
        isMaximizing
    ) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                currentBoard[i] === ""
            ) {

                currentBoard[i] =
                    "O";


                const score =
                    minimax(
                        currentBoard,
                        depth + 1,
                        false
                    );


                currentBoard[i] =
                    "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                currentBoard[i] === ""
            ) {

                currentBoard[i] =
                    "X";


                const score =
                    minimax(
                        currentBoard,
                        depth + 1,
                        true
                    );


                currentBoard[i] =
                    "";


                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


// =============================
// EVALUATE BOARD
// =============================

function evaluateBoard(
    currentBoard
) {

    for (
        const condition
        of winningConditions
    ) {

        const [a, b, c] =
            condition;


        if (
            currentBoard[a] &&
            currentBoard[a] ===
            currentBoard[b] &&
            currentBoard[a] ===
            currentBoard[c]
        ) {

            if (
                currentBoard[a] === "O"
            ) {

                return 10;

            }

            else {

                return -10;

            }

        }

    }


    if (
        currentBoard.every(cell => cell !== "")
    ) {

        return 0;

    }


    return null;

}


// =============================
// INITIAL SETTINGS
// =============================

difficultySection.style.display =
    "none";

updateScoreboard();

updateStatus();

updateActivePlayer();