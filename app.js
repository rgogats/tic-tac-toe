// The Gameboard represents the grid for tic-tac-toe
// The Cell represents each square on the grid
// The GameController handles game logic and operations - players, turns, win conditions, score

// Gameboard - grid object for gameplay, variable cells but must be equal height and width
const Gameboard = (size) => {
    const rows = size;
    const columns = size;
    const board = [];

    // create 2D array of Cells based on size param. standard 3x3
    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    // print board values in console
    const printBoardInConsole = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log('printed board', boardWithCellValues);
    };
    const clearBoard = () => {
        for(let i = 0; i < rows; i++) {
            board[i] = [];
            for(let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }
    const checkStalemate = () => {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if (board[i][j].getValue() === '') { 
                    return false;
                }
            }
        }
        return true;
    };
    const markCell = (player, row, column) => {
        const selectedCell = board[row][column];
        const result = selectedCell.getValue() === '' ? selectedCell.addMark(player) : 'Cell unavailable';
        
        // console.log('markCell result', result);
        return result;
    };

    return { getBoard, clearBoard, markCell, printBoardInConsole, checkStalemate };
};

// Cell - individual square on gameboard
const Cell = () => {
    let value = '';
    const getValue = () => value;
    const addMark = (player) => { 
        return value ? 'unavailable' : 
        value = player.mark;
    };
    return { getValue, addMark };
}

const GameController = (playerOneName, playerTwoName, rounds, size) => {
    const gameboard = Gameboard(size);
    const activeBoard = gameboard.getBoard();
    console.log('activeBoard', activeBoard);

    const players = [
        {
            name: playerOneName,
            mark: 'X',
            score: 0,
        },
        {
            name: playerTwoName,
            mark: 'O',
            score: 0,
        },
    ];
    let activePlayer = players[0];

    // switchPlayerTurn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log('switching player to', activePlayer);
    };

    // getActivePlayer
    const getActivePlayer = () => activePlayer;
    const getActiveBoard = () => activeBoard;
    
    let selectedRowIndex, selectedColIndex;
    const setCoordinates = (x, y) => {
        // selectedRowIndex, selectedColIndex = parseInt(x), parseInt(y);
        selectedRowIndex = parseInt(x);
        selectedColIndex = parseInt(y);
    };
    
    const playRound = () => {
        let roundsRemaining = rounds;
        console.log('roundsRemaining', roundsRemaining);

            // get row / column Cells based on selection
        console.log('selectedRowIndex', selectedRowIndex);
        console.log('selectedColIndex', selectedColIndex);
        const activeRow = activeBoard[selectedRowIndex];
        const activeColumn = [];
        for (let row = 0; row < activeBoard.length; row++) {
            activeColumn.push(activeBoard[row][selectedColIndex]);
        }

        // if corner is selected, get diagonal as well
        let cornerSelected = false;
        let topLeftToBottomRightDiagonal = [];
        let topRightToBottomLeftDiagonal = [];
        selectedRowIndex === 0 || selectedRowIndex === activeBoard.length - 1 ? 
        selectedColIndex === 0 || selectedColIndex === activeBoard[0].length - 1 ? (
            console.log('corner selected'),
            cornerSelected = true
        ) : null : null ;

        for (let i = 0; i < activeBoard.length; i++) {
            topLeftToBottomRightDiagonal.push(activeBoard[i][i]);
        }

        for (let i = 0; i < activeBoard.length; i++) {
            topRightToBottomLeftDiagonal.push(activeBoard[i][activeBoard.length - 1 - i]);
        }
        
        // figure out if cell is unavailable, re-do turn if so. below code does not work
        const activeCell = gameboard.markCell(activePlayer, selectedRowIndex, selectedColIndex);
        console.log('activeCell', activeCell);
        activeCell != 'Cell unavailable' ? switchPlayerTurn() : alert('Cell unavailable. Please try again');

        console.log('activeRow', activeRow.map(cell => cell.getValue()));
        console.log('activeColumn', activeColumn.map(cell => cell.getValue()));
        console.log('topLeftToBottomRightDiagonal', topLeftToBottomRightDiagonal.map(cell => cell.getValue()));
        console.log('topRightToBottomLeftDiagonal', topRightToBottomLeftDiagonal.map(cell => cell.getValue()));
        
        let playerOneHasWon = false;
        let playerTwoHasWon = false;

        playerOneHasWon = activeRow.every(cell => cell.getValue() === 'X') || activeColumn.every(cell => cell.getValue() === 'X') || topLeftToBottomRightDiagonal.every(cell => cell.getValue() === 'X') || topRightToBottomLeftDiagonal.every(cell => cell.getValue() === 'X');
        playerTwoHasWon = activeRow.every(cell => cell.getValue() === 'O') || activeColumn.every(cell => cell.getValue() === 'O') || topLeftToBottomRightDiagonal.every(cell => cell.getValue() === 'O') || topRightToBottomLeftDiagonal.every(cell => cell.getValue() === 'O');
        console.log('player one wins?', playerOneHasWon);
        console.log('player two wins?', playerTwoHasWon);
        const stalemate = gameboard.checkStalemate();
        console.log('stalemate', stalemate);

        playerOneHasWon || playerTwoHasWon || stalemate ? gameboard.clearBoard() : null;

        // if winner, decrement rounds and increment score for player
        // rounds--; activePlayer.score++;

        console.log('new activePlayer', activePlayer);
        gameboard.printBoardInConsole();
        return { playerOneHasWon, playerTwoHasWon, stalemate };
    };
        
    return { getActivePlayer, setCoordinates, getActiveBoard, playRound };
};

const UIController = (() => {
    const sizeInput = document.querySelector('input#size');
    const playerOneName = document.querySelector('input#p1');
    const playerTwoName = document.querySelector('input#p2');
    const roundsInput = document.querySelector('input#rounds');
    const startButton = document.querySelector('button#start');
    const resetButton = document.querySelector('button#reset');
    const gameboardDisplay = document.querySelector('div.gameboard');

    const resetGame = () => {
        while (gameboardDisplay.childElementCount > 0) {
            console.log('gameboardDisplay.childElementCount', gameboardDisplay.childElementCount);
            console.log('gameboardDisplay.childNodes', gameboardDisplay.childNodes);
            gameboardDisplay.childNodes.forEach((node) => {
                gameboardDisplay.removeChild(node);
            });
        }
    };

    startButton.addEventListener('click', (() => {
        // initialize GameController
        const activeGame = GameController(playerOneName, playerTwoName, parseInt(roundsInput.value), parseInt(sizeInput.value));
        console.log('activeGame', activeGame);
        // console.log('activeRound', activeRound);
        // console.log('activeGameBoard', activeGame.getActiveBoard());

        // generate grid UI
        for (let i = 0; i < sizeInput.value; i++) {
            const gridRow = document.createElement('div.grid-row');
            gridRow.style.display = 'flex';
            gridRow.style.width = '100%';
            gridRow.dataset.index = i;
            gameboardDisplay.appendChild(gridRow);
            for (let j = 0; j < sizeInput.value; j++) {
                const gridCell = document.createElement('div.grid-cell');
                gridCell.style.backgroundColor = '#d6d6d6';
                gridCell.style.padding = '50px';
                gridCell.style.border = '1px solid black';
                gridCell.dataset.xIndex = i;
                gridCell.dataset.yIndex = j;
                gridCell.addEventListener('click', (() => {
                    console.log("gridCell.dataset.xIndex", gridCell.dataset.xIndex);
                    console.log("gridCell.dataset.yIndex", gridCell.dataset.yIndex);
                    // activeGame.setCoordinates(gridCell.dataset.xIndex, gridCell.dataset.yIndex);
                    activeGame.setCoordinates(gridCell.dataset.xIndex, gridCell.dataset.yIndex);
                    gridCell.textContent = activeGame.getActivePlayer().mark;

                    const result = activeGame.playRound();
                    console.log(result);
                    result.playerOneHasWon ? (
                        alert(`${playerOneName.value} wins!`), resetGame()
                     ) : result.playerTwoHasWon ? (
                        alert(`${playerTwoName.value} wins!`), resetGame() 
                    ) : result.stalemate ? alert('It\'s a tie!') : null;
                }));
                gridRow.appendChild(gridCell);
            }
        }
    }));

    resetButton.addEventListener('click', resetGame);

    
    
})();