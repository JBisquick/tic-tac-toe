const gameBoard = (function () {
  let board = new Array(9).fill('');

  const getBoard = () => board;

  const addMark = function(e) {
    board[e.target.getAttribute('data-index')] = gameController.getCurrentPlayer().getMark();
    e.target.textContent = board[e.target.getAttribute('data-index')]
    gameController.update();

  };

  return {
    getBoard,
    addMark};
})();


const displayController = (function () {
  const displayBoard = () => {
    for (let i = 0; i < 9; i++) {
      const gridCell = document.querySelector(`[data-index="${i}"]`); 
      gridCell.textContent = gameBoard.getBoard()[i];
      
      if (gameBoard.getBoard()[i] === '') {
        gridCell.addEventListener('click', gameBoard.addMark);
      }
    }
  };

  return {
    displayBoard};
})();


const gameController = (function () {
  let currentPlayer = createPlayer('X');
  let nexPlayer = createPlayer('O');
  let turnCounter = 0;

  const startGame = () => {
    displayController.displayBoard();
  };

  const getCurrentPlayer = () => currentPlayer;

  const checkForRows = () => {
    const board = gameBoard.getBoard();
    for (i = 0; i < 7; i += 3) {
      let row = [];
      for (j = i; j < i+3; j++) {
        row.push(board[j]);
      }
      if (row.every(cell => cell =='X') || row.every(cell => cell == 'O')) {
        return true;
      }
    } 
    return false;
  };

  const checkForColumns = () => {
    const board = gameBoard.getBoard();
    for (i = 0; i < 3; i ++) {
      let column = [];
      for (j = i; j < i+7; j+=3) {
        column.push(board[j]);
      }
      if (column.every(cell => cell =='X') || column.every(cell => cell == 'O')) {
        return true;
      }
    } 
    return false;
  };

  const checkForDiagonals = () => {
    const board = gameBoard.getBoard();
    const diagonal = [[board[0], board[4], board[8] ],[board[2], board[4], board[6]]];
    if ((diagonal[0].every(cell => cell == 'X') || diagonal[0].every(cell => cell == 'O'))
      || (diagonal[1].every(cell => cell == 'X') || diagonal[1].every(cell => cell == 'O'))) {
      return true;
    } else {
      return false;
    }
  };

  const checkForWinner = () => {
    if (checkForDiagonals() || checkForColumns() || checkForRows()) {
      return true
    } else {
      return false;
    }
  };

  const checkForTie = () => {
    turnCounter += 1;
    if (turnCounter >= 8)  {
      return true;
    } else {
      return false;
    }
  };

  const update = () => {
    for (let i = 0; i < 9; i++) {
      const gridCell = document.querySelector(`[data-index="${i}"]`); 
      gridCell.removeEventListener('click', gameBoard.addMark);
    }

    [currentPlayer, nexPlayer] = [nexPlayer, currentPlayer];
    displayController.displayBoard();
  };

  return {
  startGame,
  getCurrentPlayer,
  checkForRows,
  checkForColumns,
  checkForDiagonals,
  checkForWinner,
  checkForTie,
  update};
})();


function createPlayer(mark) {
  const getMark = () => mark; 

  return {
    getMark}
};

 gameController.startGame();