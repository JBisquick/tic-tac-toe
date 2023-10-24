const gameBoard = (function () {
  let board = ['X', 'O', 'X', 'O', 'X', 'X','O', 'O','X'];
  return {board};
})();

const displayController = (function () {

})();

function createPlayer (name) {

}

function displayGameBoard (board) {
  for (let i = 0; i < 9; i++) {
    const gridCell = document.getElementById(`${i}`); 
    gridCell.textContent = board[i];
  }
}

displayGameBoard(gameBoard.board);