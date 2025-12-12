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