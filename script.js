const gameBoard = (function (){
    const rows = 3;
    const cols = 3;
    const board = [];

    function initBoard(){
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for(let j = 0; j < cols; j++){
                board[i][j] = '';
            }
        }
    }
    initBoard();
        
    function getBoard(){
        return board;
    }

    function resetBoard(){
        initBoard();
    }

    function setCell(row, col, marker){
        board[row][col] = marker;
    }

    return {getBoard, resetBoard, setCell};
})();

function player(name, marker){
    return {name, marker};
}

const gameController = (function(){
    const board = gameBoard.getBoard();
    let gameOver = false;
    const player1 = player('Player1', 'X');
    const player2 = player('Player2', 'O');
    let winner = null;
    let currPlayer = player1;
    let scores = {
        player1: 0,
        player2: 0
    };

    const getGameStatus = () => gameOver;

    const getWinner = () => winner;

    const getCurrPlayer = () => currPlayer;

    const switchPlayer = () => currPlayer = currPlayer === player1 ? player2 : player1;

    const getScores = () => ({...scores});

    function checkWinner(marker){
        //Check row wins
        for(let row = 0; row < 3; row++){
            if(
                board[row][0] === marker &&
                board[row][1] === marker &&
                board[row][2] === marker
            ){
                return true;
            }
        }

        //Check col wins
        for(let col = 0; col < 3; col++){
            if(
                board[0][col] === marker &&
                board[1][col] === marker &&
                board[2][col] === marker
            ){
                return true;
            }
        }

        //Check diagonal wins
        if(
            board[0][0] === marker &&
            board[1][1] === marker &&
            board[2][2] === marker
        ){
            return true;
        }
        if(
            board[0][2] === marker &&
            board[1][1] === marker &&
            board[2][0] === marker
        ){
            return true;
        }

        return false;
    }

    function checkTie(){
        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                if(board[row][col] === ''){
                    return false;
                }
            }
        }
        return true;
    }

    function playRound(row, col){
        if(gameOver){
            return;
        }
        if(board[row][col] !== ''){
            return;
        }

        gameBoard.setCell(row, col, currPlayer.marker);
        if(checkWinner(currPlayer.marker)){
            winner = currPlayer;
            gameOver = true;

            if(currPlayer === player1){
                scores.player1++;
            } else{
                scores.player2++;
            }
            return;
        }

        if(checkTie()){
            winner = null;
            gameOver = true;
            return;
        }
        switchPlayer();
    }

    function restartGame(){
        gameBoard.resetBoard();
        gameOver = false;
        winner = null;
        currPlayer = player1;
    }

    function resetScores(){
        scores.player1 = 0;
        scores.player2 = 0;
    }

    return {playRound, restartGame, getCurrPlayer, getGameStatus, getWinner, getScores, resetScores};
})();

const displayController = (function(){
    const boardContainer = document.querySelector('.game-board-container');
    const dialog = document.querySelector('dialog');
    const resultMsg = document.querySelector('.result-msg');
    const restartGameBtn = document.querySelector('.restart-game-btn');
    const player1Container = document.querySelector('.player1-turn-container');
    const player2Container = document.querySelector('.player2-turn-container');
    const player1Turn = document.querySelector('.player1-turn');
    const player2Turn = document.querySelector('.player2-turn');
    const player1Score = document.querySelector('.player1-score');
    const player2Score = document.querySelector('.player2-score');
    const resetScoresBtn = document.querySelector('.reset-scores-btn');

    function renderBoard(){
        boardContainer.innerHTML = '';

        const board = gameBoard.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                const boardCell = document.createElement('div');
                boardCell.classList.add('cell');

                boardCell.textContent = element;

                boardCell.dataset.row = rowIndex;
                boardCell.dataset.col = colIndex;

                boardContainer.appendChild(boardCell);

                boardCell.addEventListener('click', () => {
                    gameController.playRound(rowIndex, colIndex);
                    renderBoard();
                    updateTurnStatus();
                    checkGameStatus();
                });
            });
        });
        updateTurnStatus();
    }

    function checkGameStatus(){
        if(!gameController.getGameStatus()) return;

        const winner = gameController.getWinner();

        if(winner){
            resultMsg.textContent = `${winner.name} has won!`
        } else{
            resultMsg.textContent = 'Tie game!'
        }

        updateScores();
        dialog.showModal();
    }

    function updateTurnStatus(){
        player1Container.classList.remove('active');
        player2Container.classList.remove('active');
        player1Turn.hidden = true;
        player2Turn.hidden = true;

        if(gameController.getGameStatus()) return;

        const currentPlayer = gameController.getCurrPlayer();
        if(currentPlayer.marker === 'X'){
            player1Container.classList.add('active');
            player1Turn.textContent = `It's ${currentPlayer.name}'s turn`;
            player1Turn.hidden = false;
        } else{
            player2Container.classList.add('active');
            player2Turn.textContent = `It's ${currentPlayer.name}'s turn`;
            player2Turn.hidden = false;
        }
    }

    function updateScores(){
        const {player1, player2} = gameController.getScores();

        player1Score.textContent = player1;
        player2Score.textContent = player2;
    }

    restartGameBtn.addEventListener('click', () => {
        gameController.restartGame();
        renderBoard();
        updateTurnStatus();
        dialog.close();
    });

    resetScoresBtn.addEventListener('click', () => {
        gameController.resetScores();
        gameController.restartGame();
        updateScores();
        renderBoard();
        updateTurnStatus();
        dialog.close();
    });


    return {renderBoard};
})();

displayController.renderBoard();