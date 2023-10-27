const gameBoard = (function () {
  let board = new Array(9).fill('');

  const getBoard = () => board;

  const addMark = function(e) {
    board[e.target.getAttribute('data-index')] = gameController.getCurrentPlayer().getMark();
    e.target.textContent = board[e.target.getAttribute('data-index')]
    gameController.update();

  };

  const resetBoard = () => {
    board =  new Array(9).fill('');
  };

  return {
    getBoard,
    addMark,
    resetBoard
  };
})();


const displayController = (function () {
  const gameContainer = document.querySelector('.game-container');
  const playButton = document.createElement('button');
  const winText = document.createElement('div');
  const tieText = document.createElement('div');

  playButton.textContent = 'Play Again';
  playButton.classList.add('settings-button');
  tieText.textContent = `It is a Draw`;

  const displayBoard = () => {
    for (let i = 0; i < 9; i++) {
      const gridCell = document.querySelector(`[data-index="${i}"]`); 
      gridCell.textContent = gameBoard.getBoard()[i];
      
      if (gameBoard.getBoard()[i] === '') {
        gridCell.addEventListener('click', gameBoard.addMark);
      }
    }
  };

  const stopRound = () => {
    for (let i = 0; i < 9; i++) {
      const gridCell = document.querySelector(`[data-index="${i}"]`); 
      gridCell.removeEventListener('click', gameBoard.addMark);
    }
  };

  const displayWinText = () => {
    winText.textContent = `The Winner is ${gameController.getCurrentPlayer().getSpecies()}!`;
    gameContainer.appendChild(winText);
  };

  const displayTieText = () => {
    gameContainer.appendChild(tieText);
  };

  const displayPlayButton = () => {
    gameContainer.appendChild(playButton);
  };

  const restartDisplay = () => {
    if (gameController.checkForWinner() === true) {
      gameContainer.removeChild(winText);
      winText.textContent = '';
    }
    if (gameController.checkForTie() === true) {
      gameContainer.removeChild(tieText);
    }
    gameContainer.removeChild(playButton);

    gameBoard.resetBoard();
    displayBoard();
    gameController.restartGame();
    gameSettings.showSettings();
  };

  playButton.addEventListener('click', restartDisplay);

  return {
    displayBoard,
    stopRound,
    displayWinText,
    displayTieText,
    displayPlayButton,
    restartDisplay
  };
})();


const gameController = (function () {
  let currentPlayer = createPlayer('X', 'Rat');
  let nexPlayer = createPlayer('O', 'Cat');
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
    if (turnCounter >= 9 && checkForWinner() === false)  {
      return true;
    } else {
      return false;
    }
  };

  const update = () => {
    displayController.stopRound();
    displayController.displayBoard();

    if (checkForWinner() === true) {
      displayController.displayWinText();
      displayController.displayPlayButton();
      displayController.stopRound();
    }
    if (checkForTie() === true) {
      displayController.displayTieText();
      displayController.displayPlayButton();
      displayController.stopRound();
    }
    [currentPlayer, nexPlayer] = [nexPlayer, currentPlayer];
  };

  const restartGame = () => {
    turnCounter = 0;
  };

  return {
  startGame,
  getCurrentPlayer,
  checkForRows,
  checkForColumns,
  checkForDiagonals,
  checkForWinner,
  checkForTie,
  update,
  restartGame
  };
})();

const gameSettings = (function() {
  const starContainer = document.querySelector('.start-container');
  const startButton = document.querySelector('.start');

  const hideSettings = () => {
    starContainer.classList.remove('show');
    gameController.startGame();
  };

  const showSettings = () => {
    starContainer.classList.add('show');
  };

  const setButtons = () => {
    startButton.addEventListener('click', function() {
      hideSettings();
    });
  };

  return {
    hideSettings,
    showSettings,
    setButtons
  };
})();


function createPlayer(mark, species) {
  const getMark = () => mark; 
  const getSpecies = () => species;

  return {
    getMark,
    getSpecies
  };
};

 gameSettings.setButtons();