/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let btn = document.querySelector('button');

let players = ['red', 'blue']
let currPlayer = players[0]; // active player: 1 or 2

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
btn.addEventListener('click', newGame)


function makeBoard() {
  boardArray = [];
  for (let i = 0; i < HEIGHT; i++){
    let rowArray = [];
    for (let j = 0; j < WIDTH; j++){
      rowArray.push(null);
    }
    boardArray.push(rowArray);
  }
  return boardArray;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  // creates top row and sets eventlistener for dropping token
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  //creates tds for top row, sets unique IDs)
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // appends top row to board
  htmlBoard.append(top);

  // creates table rows for board
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // creates tds for board cells 
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    // appends board to DOM
    htmlBoard.append(row);
  }
  writeMessage(`${currPlayer}'s Turn`.toUpperCase());
  return htmlBoard;
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT -1; i >= 0; i--){
    if (!board[i][x]) return i;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const cell = document.getElementById(`${y}-${x}`);
  newPiece = document.createElement('div')
  newPiece.classList.add(currPlayer, 'piece')
  cell.append(newPiece)
}

// updates js board
function placeInBoard(y,x){
  board[y][x] = currPlayer;
}

/** endGame: announce game end */

function endGame(msg) {
  document.querySelector('#column-top').removeEventListener('click', handleClick)
  writeMessage(`${currPlayer} Wins!`);
  switchPlayers();
  setTimeout(newGame, 2000);
}

function writeMessage(str){
  let gameDiv = document.querySelector('#game');
  let h1 = document.createElement('h1');
  let message = str.toUpperCase();
  h1.innerText = message;
  h1.id = 'msg';
  h1.style.color = currPlayer;
  h1.classList.add('text');
  gameDiv.prepend(h1);
}

function deleteMessage(){
  document.querySelector('#msg').remove();
}

function newGame(){
  deleteMessage();
  htmlBoard.remove();
  const boardTable = document.createElement('table');
  boardTable.id = 'board';
  document.querySelector('#game').prepend(boardTable);
  board = makeBoard();
  htmlBoard = makeHtmlBoard();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  deleteMessage();
  // place piece in board and add to HTML table
  let dropArr = makeKeyFramesArray();
  setKeyFrames(dropArr[y]);
  placeInTable(y, x);
  placeInBoard(y,x);

 

  // check for tie
  if (checkForTie()) {
    return endGame(`It's a Tie!`);
  }

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  switchPlayers()
  
  writeMessage(`${currPlayer}'s Turn`.toUpperCase());
}


function switchPlayers(){
  players = [players[1], players [0]];
  currPlayer = players[0]
}


function checkForTie(){
  for (let cell of board[0]){
    if(cell === null) return false;
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function makeKeyFramesArray(){
  let arr = [];
  let drop = -50;
  for (let i = 0; i < 6; i++){
    arr.push(drop);
    drop -= 60;
  }
  return arr
}

function setKeyFrames(val){
  val += 'px';
  document.documentElement.style.setProperty('--drop', val);
}



let board = makeBoard();
let htmlBoard = makeHtmlBoard();


