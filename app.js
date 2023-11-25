// Use module pattern - encapsulation, closure, factory functions

// The Gameboard represents the 3x3 standard grid for tic tac toe
// The Cell represents each square on the grid
// Gameboard.markCell is base method which moves the game forward

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

    // getBoard - for UI version
    const getBoard = () => board;

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

    // markCell - determine grid cell and mark with player symbol
    const markCell = (player, row, column) => {
        const selectedCell = board[row][column];
        console.log('selectedCell', selectedCell.getValue(), 'player', player);

        return (selectedCell.getValue() === '' ? selectedCell.addMark(player) : ('unavailable', console.log('Please select an available cell'))); 
    };

    // print board values in console
    const printBoardInConsole = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log('printed board', boardWithCellValues);
    };

    return { getBoard, markCell, printBoardInConsole, checkStalemate };
};

// Cell - individual square on gameboard
const Cell = () => {
    let value = '';
    const getValue = () => value;
    const addMark = (player) => { value = player.mark };
    return { getValue, addMark };
}

// GameController - knows whos turn it is, marks cells, tracks score, and declares winner
const GameController = (rounds, size) => {
    const playerOneName = 'Ryan';
    const playerTwoName = 'Cherry';
    const gameboard = Gameboard(size);
    console.log('gameboard', gameboard.getBoard());
    const activeBoard = gameboard.getBoard();

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
    console.log('activePlayer.name', activePlayer.name);

    // switchPlayerTurn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // getActivePlayer
    const getActivePlayer = () => activePlayer;
    
    const playRound = (() => {
        let roundsRemaining = rounds;
        console.log('roundsRemaining', roundsRemaining);

        while (rounds > 0) {
            alert(`Starting round! Player: ${activePlayer.name}`);
            const selectedRowIndex = parseInt(prompt('Please enter a row:'));
            const selectedColIndex = parseInt(prompt('Please enter a column:'));

            // get row / column Cells based on selection
            const selectedRow = activeBoard[selectedRowIndex];
            const selectedColumn = [];
            for (let row = 0; row < activeBoard.length; row++) {
                selectedColumn.push(activeBoard[row][selectedColIndex]);
            }

            // if corner is selected, get diagonal as well
            let cornerSelected = false;
            let selectedDiagonal = [];
            selectedRowIndex === 0 || selectedRowIndex === activeBoard.length - 1 ? 
            selectedColIndex === 0 || selectedColIndex === activeBoard[0].length - 1 ? (
                console.log('corner selected'),
                cornerSelected = true
            ) : null : null ;

            if(cornerSelected) {
                for (let i = 0; i < activeBoard.length; i++) {
                    selectedDiagonal.push(activeBoard[i][i]);
                }
            };
            
            // figure out if cell is unavailable, re-do turn if so. below code does not work
            gameboard.markCell(activePlayer, selectedRowIndex, selectedColIndex) === 'unavailable' ? null : switchPlayerTurn();
            console.log('selectedRow', selectedRow.map(cell => cell.getValue()));
            console.log('selectedColumn', selectedColumn.map(cell => cell.getValue()));
            console.log('selectedDiagonal', selectedDiagonal.map(cell => cell.getValue()));
            
            let playerOneHasWon = false;
            let playerTwoHasWon = false;

            // check win condition by row and column
            playerOneHasWon = selectedRow.every(cell => cell.getValue() === 'X') || selectedColumn.every(cell => cell.getValue() === 'X') // || selectedDiagonal.every(cell => cell.getValue() === 'X');
            playerTwoHasWon = selectedRow.every(cell => cell.getValue() === 'O') || selectedColumn.every(cell => cell.getValue() === 'O') // || selectedDiagonal.every(cell => cell.getValue() === 'O');
            console.log('player one wins?', playerOneHasWon);
            console.log('player two wins?', playerTwoHasWon);
            console.log('board full / stalemate', gameboard.checkStalemate());

            // if winner, decrement rounds and increment score for player
            // rounds--; activePlayer.score++;

            console.log('new activePlayer', activePlayer);
            gameboard.printBoardInConsole();
        };

    });

    return { getActivePlayer, playRound };
}

GameController(5, 3).playRound();