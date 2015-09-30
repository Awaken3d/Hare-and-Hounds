var gameLogic;
(function (gameLogic) {
    //the variables below are used to trace previous dog and bunny positions
    gameLogic.legalMovesDog = [[[[0, 1], [1, 1], [1, 2]], [[0, 2], [1, 2]], [[1, 3], [1, 4]]], [[[0, 0], [1, 1], [2, 0]], [[0, 0], [1, 2], [2, 0]], [[0, 1], [2, 1], [0, 2], [1, 3], [2, 2]], [[0, 2], [2, 2], [1, 4]], []], [[[1, 1], [1, 2], [2, 1]], [[1, 2], [2, 2]], [[1, 3], [1, 4]]]];
    gameLogic.legalMovesBunny = [[[[1, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 2], [1, 2]], [[0, 1], [1, 2], [1, 3], [1, 4]]], [[], [[0, 0], [1, 2], [2, 0]], [[0, 0], [2, 1], [1, 1], [0, 1], [2, 1], [0, 2], [1, 3], [2, 2]], [[1, 2], [0, 2], [2, 2], [1, 4]], [[0, 2], [1, 3], [2, 2]]], [[[1, 0], [1, 1], [1, 2], [2, 1]], [[2, 0], [1, 2], [2, 2]], [[2, 1], [1, 3], [1, 4]]]];
    gameLogic.bunnyPosition = { line: 0, column: 0 };
    gameLogic.dogPosition = [{ line: 0, column: 0 }, { line: 0, column: 0 }, { line: 0, column: 0 }];
    /** sets initial positions for the bunny and the dogs */
    function setInitialPositions() {
        gameLogic.bunnyPosition.line = 1;
        gameLogic.bunnyPosition.column = 4;
        gameLogic.dogPosition[0].line = 0;
        gameLogic.dogPosition[0].column = 0;
        gameLogic.dogPosition[1].line = 1;
        gameLogic.dogPosition[1].column = 0;
        gameLogic.dogPosition[2].line = 2;
        gameLogic.dogPosition[2].column = 0;
    }
    gameLogic.setInitialPositions = setInitialPositions;
    //counts the number of turns taken by both players, if it exceeds 20 the game is over and the bunny wins
    var turnsTake = 0;
    function incrementTurn() {
        this.turnsTake++;
    }
    gameLogic.incrementTurn = incrementTurn;
    function getTurns() {
        return this.turnsTake;
    }
    gameLogic.getTurns = getTurns;
    /** Returns the initial Hare and Hounds board, which is a 2d matrix  */
    function getInitialBoard() {
        //bunnyPosition.line =1;
        setInitialPositions();
        return [['D1', '', ''], ['D2', '', '', '', 'B'], ['D3', '', '']];
    }
    gameLogic.getInitialBoard = getInitialBoard;
    /*hounds can only win if they corner the bunny in the initial position or in the middle of the first and last row
    (though the latter positions are really hard to achieve)*/
    function bunnyBlocked(board) {
        if ((board[1][4] == 'B' && board[0][2].charAt(0) == 'D' && board[1][3].charAt(0) == 'D' && board[2][2].charAt(0) == 'D') || board[0][1] == 'B' && board[0][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[0][2].charAt(0) == 'D' || board[2][1] == 'B' && board[2][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[2][2].charAt(0) == 'D') {
            return true;
        }
        else {
            return false;
        }
    }
    gameLogic.bunnyBlocked = bunnyBlocked;
    /*
     export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
     var possibleMoves: IMove[] = [];
     for (var i = 0; i < 3; i++) {
     for (var j = 0; j < board[i].length; j++) {
     try {
     possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
     } catch (e) {
     // The cell in that position was full.
     }
     }
     }
     return possibleMoves;
     }
     */
    /*used to copy an array to another array by value to avoid assignment by reference, angular wouldn't work for me, i
    * have to take a look at it later*/
    function arraysEqual(arr1, arr2) {
        if (arr1 == null || arr2 == null) {
            return false;
        }
        if (arr1.length !== arr2.length)
            return false;
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    function copy(arr) {
        var new_arr = arr.slice(0);
        for (var i = arr.length; i--;)
            if (new_arr[i] instanceof Array)
                new_arr[i] = copy(arr[i]);
        return new_arr;
    }
    /*uses pawn id to identify which dog was chosen to move, the existence of var id is redundant since a simple
    * subtraction from pawnId can yield the same results, fix it*/
    function createMove(board, pawnID, row, col, turnIndexBeforeMove) {
        var moveArray = [row, col];
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        if (board[row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        if (getWinner(board) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        if (col < 0) {
            throw new Error("Column value cannot be lower than 0");
        }
        if (row < 0) {
            throw new Error("Row value cannot be lower than 0");
        }
        else if (row > 2) {
            throw new Error("Row value cannot be higher than 2");
        }
        if (row == 1 && col > 4) {
            throw new Error("Column value is too high");
        }
        else if ((row === 0 || row === 2) && col > 2) {
            throw new Error("Column value is too high");
        }
        if (turnIndexBeforeMove === 1) {
            /*
             if((bunnyPosition.column == 1 && bunnyPosition.line == 0) || (bunnyPosition.column == 1 && bunnyPosition.line == 2)){
             if((col == 1 && row == 1)|| (col == 3 && row == 1)){
             throw new Error("Cannot move there!");
             }
             }
             */
            /*
             if((bunnyPosition.column == 1 && bunnyPosition.line == 1) || (bunnyPosition.column == 3 && bunnyPosition.line == 1)){
             if((col == 1 && row == 0)|| (col == 1 && row == 2)){
             throw new Error("Cannot move there!");
             }
             }
             */
            var existsInLegalMoves = false;
            for (var i in gameLogic.legalMovesBunny) {
                if (arraysEqual(moveArray, gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column][i])) {
                    existsInLegalMoves = true;
                }
            }
            if (!existsInLegalMoves) {
                throw new Error("Cannot move there!");
            }
        }
        else {
            var id;
            if (pawnID == 1) {
                id = 0;
            }
            else if (pawnID == 2) {
                id = 1;
            }
            else {
                id = 2;
            }
            /*
             if(dogPosition[id].column > col){
             throw new Error("Dogs can only move forward!");
             }
             */
            var existsInLegalMoves2 = false;
            for (var i in gameLogic.legalMovesDog) {
                if (arraysEqual(moveArray, gameLogic.legalMovesDog[gameLogic.dogPosition[id].line][gameLogic.dogPosition[id].column][i])) {
                    existsInLegalMoves2 = true;
                }
            }
            if (!existsInLegalMoves2) {
                throw new Error("Cannot move there!");
            }
        }
        // var boardAfterMove = angular.copy(board);
        var boardAfterMove = copy(board);
        boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'D' : 'B';
        if (turnIndexBeforeMove === 1) {
            boardAfterMove[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column] = '';
            boardAfterMove[row][col] = 'B';
            gameLogic.bunnyPosition.line = row;
            gameLogic.bunnyPosition.column = col;
        }
        else {
            boardAfterMove[gameLogic.dogPosition[pawnID - 1].line][gameLogic.dogPosition[pawnID - 1].column] = '';
            boardAfterMove[row][col] = 'D' + "" + (pawnID);
            gameLogic.dogPosition[pawnID - 1].line = row;
            gameLogic.dogPosition[pawnID - 1].column = col;
        }
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: winner === 'D' ? [1, 0] : winner === 'B' ? [0, 1] : [0, 0] } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
        }
        var delta = { row: row, col: col };
        for (var i in boardAfterMove) {
            for (var j in boardAfterMove[i]) {
                console.log(boardAfterMove[i][j]);
            }
        }
        return [firstOperation, { set: { key: 'board', value: boardAfterMove } }, { set: { key: 'delta', value: delta } }];
    }
    gameLogic.createMove = createMove;
    //checks if the game is over
    function getWinner(board) {
        // var counter : turnCounter = new turnCounter();
        if (gameLogic.bunnyPosition.column <= gameLogic.dogPosition[0].column && gameLogic.bunnyPosition.column <= gameLogic.dogPosition[1].column && gameLogic.bunnyPosition.column <= gameLogic.dogPosition[3].column) {
            return 'B';
        }
        else if (getTurns() == 20) {
            return 'B';
        }
        else if (bunnyBlocked(board)) {
            return 'D';
        }
        return '';
    }
    gameLogic.getWinner = getWinner;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        var pawnId = params.pawnId;
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]
            //var deltaValue: BoardDelta = move[2].set.value;
            //var row = deltaValue.row;
            //var col = deltaValue.col;
            var row = move[2].set.value.row;
            var col = move[2].set.value.col;
            var board = stateBeforeMove.board;
            //console.log(board);
            /*for(var j=0;j<3;j++){
             for(var i =0 ;i<board[j].length;i++){

             console.log(j+" "+i+" "+board[j][i]);
             }
             }*/
            var expectedMove = createMove(board, pawnId, row, col, turnIndexBeforeMove);
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            console.log(e);
            return false;
        }
        incrementTurn();
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map