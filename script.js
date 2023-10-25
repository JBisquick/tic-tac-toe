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

  const startGame = () => {
    displayController.displayBoard();
  };

  const getCurrentPlayer = () => currentPlayer;

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
  update};
})();


function createPlayer(mark) {
  const getMark = () => mark; 

  return {
    getMark}
};

 gameController.startGame();