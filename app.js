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

const GameController = (rounds, size) => {
    const playerOneName = 'Ryan';
    const playerTwoName = 'Cherry';
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
    
    const playRound = (playerOneRow, playerOneCol, playerTwoRow, playerTwoCol) => {
        let roundsRemaining = rounds;
        console.log('roundsRemaining', roundsRemaining);

        while (rounds > 0) {
            alert(`Starting round! Player: ${activePlayer.name}`);
            const selectedRowIndex = parseInt(prompt('Please enter a row:'));
            const selectedColIndex = parseInt(prompt('Please enter a column:'));

            // get row / column Cells based on selection
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
            // console.log('activeCell', activeCell);
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
            console.log('board full / stalemate', gameboard.checkStalemate());

            playerOneHasWon || playerTwoHasWon || gameboard.checkStalemate() ? gameboard.clearBoard() : null;

            // if winner, decrement rounds and increment score for player
            // rounds--; activePlayer.score++;

            console.log('new activePlayer', activePlayer);
            gameboard.printBoardInConsole();
        };

    };

    return { getActivePlayer, getActiveBoard, playRound };
};

const UIController = (() => {
    const sizeInput = document.querySelector('input#size');
    const roundsInput = document.querySelector('input#rounds');
    const startButton = document.querySelector('button#start');
    const gameboardDisplay = document.querySelector('div.gameboard');

    startButton.addEventListener('click', (() => {
        // initialize GameController
        const activeGame = GameController(parseInt(roundsInput.value), parseInt(sizeInput.value));
        // console.log('activeGame', activeGame);
        // console.log('activeGameBoard', activeGame.getActiveBoard());
        // generate grid UI
        for (let i = 0; i < sizeInput.value; i++) {
            const gridRow = document.createElement('div.grid-row');
            gridRow.style.display = 'flex';
            gridRow.style.width = '100%';
            gameboardDisplay.appendChild(gridRow);
            for (let j = 0; j < sizeInput.value; j++) {
                const gridCell = document.createElement('div.grid-cell');
                gridCell.style.backgroundColor = '#d6d6d6';
                gridCell.style.padding = '50px';
                gridCell.style.border = '1px solid black';
                gridCell.addEventListener('click', (() => {
                    activeGame.
                }));
                gridRow.appendChild(gridCell);
            }
        }
        activeGame.playRound();
    }));

    
    
})();