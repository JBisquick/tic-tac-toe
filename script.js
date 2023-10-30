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

  const getEmptyBoardIndex = () => {
    let indexBoard = [];
    let i = 0;
    for (const position of board) {
      if (position === '') {
        indexBoard.push(i);
      }
      i += 1;
    }
    return indexBoard;
  };

  return {
    getBoard,
    addMark,
    resetBoard,
    getEmptyBoardIndex
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
    if (gameController.checkForWin(gameBoard.getBoard()) === true) {
      gameContainer.removeChild(winText);
      winText.textContent = '';
    }
    if (gameController.checkForTie(gameBoard.getBoard()) === true) {
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
  // nextPlayer represents AI in singleplayer
  // currentPlayer/nextPlayer can change values from other functions4
  let nextPlayer = createPlayer('O', 'Cat');
  let turnCounter = 0;

  const startGame = () => {
    if (getCurrentPlayer().getSpecies() === 'Cat') {
      minimaxAI.makeRandomMove();
      turnCounter += 1;
    }
    displayController.displayBoard();
  };

  const makePlayerRat = () => {
    currentPlayer = createPlayer('X', 'Rat');
    nextPlayer = createPlayer('O', 'Cat');
  };

  const makePlayerCat = () => {
    currentPlayer = createPlayer('O', 'Cat');
    nextPlayer = createPlayer('X', 'Rat');
  };

  const getCurrentPlayer = () => currentPlayer;

  const getAiPlayer = () => nextPlayer;

  const checkForRows = (board) => {
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

  const checkForColumns = (board) => {
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

  const checkForDiagonals = (board) => {
    const diagonal = [[board[0], board[4], board[8] ],[board[2], board[4], board[6]]];
    if ((diagonal[0].every(cell => cell == 'X') || diagonal[0].every(cell => cell == 'O'))
      || (diagonal[1].every(cell => cell == 'X') || diagonal[1].every(cell => cell == 'O'))) {
      return true;
    } else {
      return false;
    }
  };

  const checkForWin = (board) => {
    if (checkForDiagonals(board) || checkForColumns(board) || checkForRows(board)) {
      return true
    } else {
      return false;
    }
  };

  const checkForTie = (board) => {
    turnCounter += 1;
    if (turnCounter >= 9 && checkForWin(board) === false)  {
      return true;
    } else {
      return false;
    }
  };

  const update = () => {
    if (gameSettings.getMode() === 'ai' &&  checkForWin(gameBoard.getBoard()) === false) {
      minimaxAI.makeRandomMove();
      turnCounter += 1;
      [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer];
    }
    
    displayController.stopRound();
    displayController.displayBoard();

    if (checkForWin(gameBoard.getBoard()) === true) {
      displayController.displayWinText();
      displayController.displayPlayButton();
      displayController.stopRound();
    }
    if (checkForTie(gameBoard.getBoard()) === true) {
      displayController.displayTieText();
      displayController.displayPlayButton();
      displayController.stopRound();
    }

    [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer];

  };

  const restartGame = () => {
    turnCounter = 0;
    makePlayerRat();
  };

  return {
  startGame,
  makePlayerRat,
  makePlayerCat,
  getCurrentPlayer,
  getAiPlayer,
  checkForRows,
  checkForColumns,
  checkForDiagonals,
  checkForWin,
  checkForTie,
  update,
  restartGame
  };
})();

const gameSettings = (function() {
  const starContainer = document.querySelector('.start-container');
  const startButton = document.querySelector('.start');
  const modeButton = document.querySelector('.mode');
  const rat = document.querySelector('#rat');
  const cat = document.querySelector('#cat');
  let mode = 'player';

  const hideSettings = () => {
    starContainer.classList.remove('show');
    gameController.startGame();
  };

  const showSettings = () => {
    starContainer.classList.add('show');
  };

  const chooseAnimal = function(e) {
    if (e.target.class === 'glow') {
      return;
    }

    if (e.target.id === 'cat') {
      gameController.makePlayerCat();
      e.target.classList.add('glow');
      rat.classList.remove('glow');
    } else {
      gameController.makePlayerRat();
      e.target.classList.add('glow');
      cat.classList.remove('glow');
    }
  };

  const changeMode = () => {
    if (mode === 'player') {
      mode = 'ai';
      modeButton.textContent = 'Player vs AI';
      rat.classList.add('glow');
      rat.addEventListener('click', chooseAnimal);
      cat.addEventListener('click', chooseAnimal);
    } else {
      mode = 'player';
      modeButton.textContent = 'Player vs Player';
      gameController.makePlayerRat();
      rat.classList.remove('glow');
      cat.classList.remove('glow');
      rat.removeEventListener('click', chooseAnimal);
      cat.removeEventListener('click', chooseAnimal);
    }
  };

  const getMode = () => mode;

  const setButtons = () => {
    startButton.addEventListener('click', hideSettings);
    modeButton.addEventListener('click', changeMode);
  };

  return {
    hideSettings,
    showSettings,
    chooseAnimal,
    changeMode,
    getMode,
    setButtons
  };
})();

const minimaxAI = (function() {

  const makeRandomMove = () => {
    randomMove = Math.floor(Math.random() * gameBoard.getEmptyBoardIndex().length);
    finalMove = gameBoard.getEmptyBoardIndex()[randomMove];
    gameBoard.getBoard()[finalMove] = gameController.getAiPlayer().getMark();
  };

  const getScore = (game, depth, player) => { 
    if (gameController.checkForWin(game) && 
    (gameController.getAiPlayer.getSpecies() === player.getSpecies())) {
      return 10 - depth;
    } else if (gameController.checkForWin(game) && 
    (gameController.getCurrentPlayer.getSpecies() === player.getSpecies())) {
      return depth - 10;
    } else {
      return 0;
    }
  };
  
  return {
    makeRandomMove,
    getScore
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