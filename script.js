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
    let currPlayer = player1;

    const switchPlayer = () => {currPlayer = currPlayer === player1 ? player2 : player1};

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
            gameOver = true;
            return;
        }
        if(checkTie()){
            gameOver = true;
            return;
        }
        switchPlayer();
    }

    return {playRound}
})();

// console.log(gameController.playRound(0,0));
// console.log(gameController.playRound(1,0));
// console.log(gameController.playRound(0,1));
// console.log(gameController.playRound(1,1));
// console.log(gameController.playRound(0,2));
// console.log(gameController.playRound(2,2));


// console.log(gameBoard.getBoard());