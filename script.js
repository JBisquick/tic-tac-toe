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

  const getNewBoard = (aiBoard, move, mark) => {
    aiBoard[move] = mark;
    return aiBoard;
  };

  return {
    getBoard,
    addMark,
    resetBoard,
    getEmptyBoardIndex,
    getNewBoard
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

  const startGame = () => {
    if (getCurrentPlayer().getSpecies() === 'Cat') {
      minimaxAI.makeRandomMove();
      gameBoard.getBoard()[minimaxAI.getMove()] = gameController.getAiPlayer().getMark();
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
    let tie = true;
    for (const position of board) {
      if (position === '' || (checkForWin(board) === tie)) {
        tie = false;
      }
    }
    return tie;
  };

  const update = () => {
    if (gameSettings.getMode() === 'ai' &&  checkForWin(gameBoard.getBoard()) === false) {
      minimaxAI.makeAiMove(gameBoard.getBoard(), 0, gameController.getAiPlayer());
      gameBoard.getBoard()[minimaxAI.getMove()] = gameController.getAiPlayer().getMark();
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
  const diffButton = document.querySelector('.diff');
  const rat = document.querySelector('#rat');
  const cat = document.querySelector('#cat');
  let mode = 'player';
  let difficulty = 25;

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

  const changeDifficulty = () => {
    // loops between difficulties
    // changes chance of the choice to be smart instead for random
    switch(difficulty) {
      case 25:
        difficulty = 50;
        diffButton.textContent = 'Medium';
        break;
      case 50:
        difficulty = 75;
        diffButton.textContent = 'Hard';
        break;
      case 75:
        difficulty = 100;
        diffButton.textContent = 'Unbeatable';
        break;
      case 100:
        difficulty = 25;
        diffButton.textContent = 'Easy';
        break;
    }
  };

  const getDifficulty = () => difficulty;

  const setButtons = () => {
    startButton.addEventListener('click', hideSettings);
    modeButton.addEventListener('click', changeMode);
    diffButton.addEventListener('click', changeDifficulty);
  };

  return {
    hideSettings,
    showSettings,
    chooseAnimal,
    changeMode,
    getMode,
    changeDifficulty,
    getDifficulty,
    setButtons
  };
})();

const minimaxAI = (function() {
  let choice;

  const makeRandomMove = () => {
    randomMove = Math.floor(Math.random() * gameBoard.getEmptyBoardIndex().length);
    finalMove = gameBoard.getEmptyBoardIndex()[randomMove];
    choice = finalMove;
  };

  const getScore = (game, depth, player) => { 
    if (gameController.checkForWin(game) && 
    (gameController.getAiPlayer().getSpecies() === player.getSpecies())) {
      return depth - 10;
    } else if (gameController.checkForWin(game) && 
    (gameController.getCurrentPlayer().getSpecies() === player.getSpecies())) {
      return 10 - depth;
    } else {
      return 0;
    }
  };

  const findMaxScoreIndex = (scores) => {
    let i = 0;
    let maxScore = -10;
    let maxIndex = 0;
    for (const score of scores) {
      if (maxScore < score) {
        maxScore = score;
        maxIndex = i;
      } 

      i += 1;
    }
    return maxIndex;
  };

  const findMinScoreIndex = (scores) => {
    let i = 0;
    let minScore = 10;
    let minIndex = 0;
    for (const score of scores) {
      if (minScore > score) {
        minScore = score;
        minIndex = i;
      }
      i += 1;
    }
    return minIndex;
  };

  const findBestMove = (moves, scores, player) => {
    if (player.getMark() === gameController.getAiPlayer().getMark()) {
      maxMoveIndex = findMaxScoreIndex(scores);
      choice = moves[maxMoveIndex];
      return scores[maxMoveIndex];
    } else {
      minMoveIndex = findMinScoreIndex(scores); 
      choice = moves[minMoveIndex];
      return scores[minMoveIndex];
    }
  };

  const minimax = (game, depth, player) => {
    if (gameController.checkForWin(game) || gameController.checkForTie(game)) {
      return getScore(game, depth, player);
    }
    depth += 1;
    let scores = [];
    let moves = [];

    for (const move of gameBoard.getEmptyBoardIndex()) {
      let possibleGame = gameBoard.getNewBoard(game, move, player.getMark());
      if (player.getMark() === gameController.getAiPlayer().getMark()) {
        scores.push(minimax(possibleGame, depth, gameController.getCurrentPlayer()));
      } else {
        scores.push(minimax(possibleGame, depth, gameController.getAiPlayer()));
      }
      moves.push(move);
      possibleGame = gameBoard.getNewBoard(game, move,'');
    }
    return findBestMove(moves, scores, player);
  };

  const getMove = () => choice;

  const makeAiMove = (game, depth, player) => {
    randomNumber = Math.floor(Math.random() * 100);
    if (gameSettings.getDifficulty() > randomNumber) {
      console.log('yes')
      minimax(gameBoard.getBoard(), 0, gameController.getAiPlayer());
    } else {
      makeRandomMove();
    }
  };
  
  return {
    makeRandomMove,
    getScore,
    findMaxScoreIndex,
    findMinScoreIndex,
    findBestMove,
    minimax,
    getMove,
    makeAiMove
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