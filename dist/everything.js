var gameLogic;
(function (gameLogic) {
    //the variables below are used to trace previous dog and bunny positions
    gameLogic.legalMovesDog = [[[[0, 1], [1, 1], [1, 2]], [[0, 2], [1, 2]], [[1, 3], [1, 4]]],
        [[[0, 0], [1, 1], [2, 0]], [[0, 0], [1, 2], [2, 0]], [[0, 1], [2, 1], [0, 2], [1, 3], [2, 2]],
            [[0, 2], [2, 2], [1, 4]], []], [[[1, 1], [1, 2], [2, 1]], [[1, 2], [2, 2]], [[1, 3], [1, 4]]]];
    gameLogic.legalMovesBunny = [[[[1, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 2], [1, 2]], [[0, 1], [1, 2], [1, 3], [1, 4]]],
        [[], [[1, 0], [0, 0], [1, 2], [2, 0]], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 3], [2, 0], [2, 1], [2, 2]],
            [[1, 2], [0, 2], [2, 2], [1, 4]], [[0, 2], [1, 3], [2, 2]]],
        [[[1, 0], [1, 1], [1, 2], [2, 1]], [[2, 0], [1, 2], [2, 2]], [[2, 1], [1, 3], [1, 2], [1, 4]]]];
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
    gameLogic.turnsTake = 0;
    function incrementTurn() {
        this.turnsTake++;
    }
    gameLogic.incrementTurn = incrementTurn;
    /** Returns the initial Hare and Hounds board, which is a 2d matrix  */
    function getInitialBoard() {
        setInitialPositions();
        return [['D1', '', ''],
            ['D2', '', '', '', 'B'],
            ['D3', '', '']];
    }
    gameLogic.getInitialBoard = getInitialBoard;
    /*hounds can only win if they corner the bunny in the initial position or in the middle of the first and last row
    (though the latter positions are really hard to achieve)*/
    function bunnyBlocked(board) {
        if ((board[1][4] == 'B' && board[0][2].charAt(0) == 'D' && board[1][3].charAt(0) == 'D' && board[2][2].charAt(0) == 'D') ||
            board[0][1] == 'B' && board[0][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[0][2].charAt(0) == 'D' ||
            board[2][1] == 'B' && board[2][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[2][2].charAt(0) == 'D') {
            return true;
        }
        else {
            return false;
        }
    }
    gameLogic.bunnyBlocked = bunnyBlocked;
    function getBunnyPosition(board) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] === 'B') {
                    return { row: i, col: j };
                }
            }
        }
    }
    gameLogic.getBunnyPosition = getBunnyPosition;
    function getDogPositions(board) {
        var dogPositions = [{ row: undefined, col: undefined }, { row: undefined, col: undefined }, { row: undefined, col: undefined }];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j].charAt(0) === 'D') {
                    if (board[i][j].charAt(1) === '1') {
                        dogPositions[0] = { row: i, col: j };
                    }
                    else if (board[i][j].charAt(1) === '2') {
                        dogPositions[1] = { row: i, col: j };
                    }
                    else {
                        dogPositions[2] = { row: i, col: j };
                    }
                }
            }
        }
        console.log("printing dog positions");
        console.log(dogPositions[0]);
        console.log(dogPositions[1]);
        console.log(dogPositions[2]);
        return dogPositions;
    }
    gameLogic.getDogPositions = getDogPositions;
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
    gameLogic.arraysEqual = arraysEqual;
    function copy(arr) {
        var new_arr = arr.slice(0);
        for (var i = arr.length; i--;)
            if (new_arr[i] instanceof Array)
                new_arr[i] = copy(arr[i]);
        return new_arr;
    }
    function determinePawn(board, deltaFrom) {
        var pawn = board[deltaFrom.row][deltaFrom.col];
        if (pawn.charAt(0) != '') {
            return pawn;
        }
        else {
            return '';
        }
    }
    gameLogic.determinePawn = determinePawn;
    function getTurn(turnIndex) {
        return (turnIndex === 0 ? 'D' : 'B');
    }
    gameLogic.getTurn = getTurn;
    function createMove(board, deltaFrom, deltaTo, turnIndexBeforeMove) {
        var moveArrayFrom = [deltaFrom.row, deltaFrom.col];
        var moveArrayTo = [deltaTo.row, deltaTo.col];
        console.log(moveArrayTo);
        //console.log(" creating move to row "+row + " and col "+col );
        //console.log( "and id is "+pawnID);
        //console.log(moveArray);
        if (!board) {
            console.log(" creating new board");
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        var pawn = determinePawn(board, deltaFrom);
        if (deltaTo.col < 0) {
            throw new Error("Column value cannot be lower than 0");
        }
        if (deltaTo.row < 0) {
            throw new Error("Row value cannot be lower than 0");
        }
        else if (deltaTo.row > 2) {
            throw new Error("Row value cannot be higher than 2");
        }
        if (deltaTo.row == 1 && deltaTo.col > 4) {
            throw new Error("Column value is too high");
        }
        else if ((deltaTo.row === 0 || deltaTo.row === 2) && deltaTo.col > 2) {
            throw new Error("Column value is too high");
        }
        if (board[deltaTo.row][deltaTo.col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        if (getWinner(board) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        if (pawn === '') {
            throw new Error(" the original position contained no pawn");
        }
        if (getTurn(turnIndexBeforeMove) !== pawn.charAt(0)) {
            throw new Error("It is not that pawn's turn to move");
        }
        console.log(" it's the " + getTurn(turnIndexBeforeMove) + " move");
        console.log("the pawn chosen is " + pawn.charAt(0));
        if (getTurn(turnIndexBeforeMove) === 'B') {
            console.log("nomizei oti paizei o lagos");
            var existsInLegalMoves = false;
            //for(var i in legalMovesBunny){
            for (var i = 0; i < gameLogic.legalMovesBunny[deltaFrom.row][deltaFrom.col].length; i++) {
                //console.log("arrays checked " + legalMovesBunny[bunnyPosition.line][bunnyPosition.column][i]);
                //console.log("value of i is "+i);
                //if(arraysEqual(moveArrayTo, legalMovesBunny[deltaFrom.row][deltaFrom.col][i])){
                if (angular.equals(moveArrayTo, gameLogic.legalMovesBunny[deltaFrom.row][deltaFrom.col][i])) {
                    existsInLegalMoves = true;
                }
            }
            if (!existsInLegalMoves) {
                throw new Error("Cannot move there bunny!");
            }
        }
        else {
            var id;
            if (+pawn.charAt(1) === 1) {
                id = 0;
            }
            else if (+pawn.charAt(1) === 2) {
                id = 1;
            }
            else if (+pawn.charAt(1) === 3) {
                id = 2;
            }
            var existsInLegalMoves2 = false;
            //for(var i in legalMovesDog){
            for (var i = 0; i < gameLogic.legalMovesDog[deltaFrom.row][deltaFrom.col].length; i++) {
                console.log(gameLogic.legalMovesDog[deltaFrom.row][deltaFrom.col][i]);
                //console.log("value of i is "+i);
                //if(arraysEqual(moveArrayTo, legalMovesDog[deltaFrom.row][deltaFrom.col][i])){
                if (angular.equals(moveArrayTo, gameLogic.legalMovesDog[deltaFrom.row][deltaFrom.col][i])) {
                    console.log("tairiakse me kapoio");
                    existsInLegalMoves2 = true;
                }
            }
            if (!existsInLegalMoves2) {
                throw new Error("Cannot move there dog!");
            }
        }
        // var boardAfterMove = angular.copy(board);
        var boardAfterMove = copy(board);
        if (getTurn(turnIndexBeforeMove) === 'B') {
            boardAfterMove[deltaFrom.row][deltaFrom.col] = '';
            boardAfterMove[deltaTo.row][deltaTo.col] = 'B';
        }
        else {
            boardAfterMove[deltaFrom.row][deltaFrom.col] = '';
            boardAfterMove[deltaTo.row][deltaTo.col] = 'D' + "" + (pawn.charAt(1));
        }
        incrementTurn();
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '') {
            console.log("someone won");
            // Game over.
            firstOperation = { endMatch: { endMatchScores: winner === 'D' ? [1, 0] : winner === 'B' ? [0, 1] : [0, 0] } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
        }
        var delta = { row: deltaTo.row, col: deltaTo.col };
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'deltaFrom', value: { row: deltaFrom.row, col: deltaFrom.col } } },
            { set: { key: 'deltaTo', value: { row: deltaTo.row, col: deltaTo.col } } }];
    }
    gameLogic.createMove = createMove;
    //checks if the game is over
    function getWinner(board) {
        var bunnyCol;
        var dogCol = [undefined, undefined, undefined];
        var bunnyPosition = getBunnyPosition(board);
        //console.log( getDogPositions(board));
        var dogPositions = getDogPositions(board);
        if (bunnyPosition.row === 1) {
            bunnyCol = bunnyPosition.col - 1;
        }
        else {
            bunnyCol = bunnyPosition.col;
        }
        for (var i = 0; i < dogPositions.length; i++) {
            if (dogPositions[i].row === 1) {
                dogCol[i] = dogPositions[i].col - 1;
            }
            else {
                dogCol[i] = dogPositions[i].col;
            }
        }
        if (bunnyCol <= dogCol[0] && bunnyCol <= dogCol[1] && bunnyCol <= dogCol[2]) {
            console.log("bunny won");
            return 'B';
        }
        else if (gameLogic.turnsTake === 20) {
            console.log(" more than twenty moves");
            return 'B';
        }
        else if (bunnyBlocked(board)) {
            console.log("dog moved");
            return 'D';
        }
        return '';
    }
    gameLogic.getWinner = getWinner;
    function isMoveOk(params) {
        /*
                var move = params.move;
                var turnIndexBeforeMove = params.turnIndexBeforeMove;
                var stateBeforeMove: IState = params.stateBeforeMove;
                var deltaTest:BoardDelta = move[2].set.value;
                console.log(" delta received from emulator is "+ deltaTest.row+ " "+deltaTest.col);
                var pawnId:number = params.pawnId;
                //console.log(" pawid received from emulator is "+ pawnId);
                  //console.log(" turn index before move received from emulator is "+ turnIndexBeforeMove);
                  console.log(" move variable received from emulator is "+ move[1].set.value);
        */
        /*

        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that move is legal.
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]

            var row = move[2].set.value.row;
            var col = move[2].set.value.col;

            var board = stateBeforeMove.board;

            var expectedMove = createMove(board,pawnId, row, col, turnIndexBeforeMove);

        } catch (e) {

            console.log(e);
            return false;
        }
        incrementTurn();*/
        //return true;
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        /* We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
         * to verify that move is legal. */
        try {
            var deltaFrom = move[2].set.value;
            console.log("delta from is " + deltaFrom.row + " " + deltaFrom.col);
            var deltaTo = move[3].set.value;
            console.log("delta to is " + deltaTo.row + " " + deltaTo.col);
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, deltaFrom, deltaTo, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
        //return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
;var game;
(function (game) {
    var animationEnded = false;
    var numberOfClicks = 0; //counts the number of clicks to make sure that a legitimate pawn was selected to move
    //let rowToMove:number;
    //let colToMove:number;
    var canMakeMove = false;
    var isComputerTurn = false;
    var lastUpdateUI = null;
    var state = null;
    game.isHelpModalShown = false;
    var turnIndex = null;
    var deltaFrom = { row: -1, col: -1 };
    var deltaTo = { row: -1, col: -1 };
    var pawnId;
    var draggingPiece;
    var gameArea;
    function getSource(row, col) {
        if (state.board[row][col].charAt(0) === 'B') {
            return "rabbit";
        }
        else {
            return "dog";
        }
    }
    game.getSource = getSource;
    function printBoard() {
        for (var i = 0; i < state.board.length; i++) {
            for (var j = 0; j < state.board[i].length; j++) {
                console.log(state.board[i][j]);
            }
        }
    }
    game.printBoard = printBoard;
    function handleDragEvent(type, clientX, clientY) {
        gameArea = document.getElementById("gameArea");
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        //console.log("client x is "+clientX);
        //console.log("client y is "+clientY);
        //console.log(" client offset left is "+gameArea.offsetLeft);
        //console.log(" client offset top is "+gameArea.offsetTop);
        var col = Math.floor(5 * x / gameArea.clientWidth);
        var row = Math.floor(3 * y / gameArea.clientHeight);
        if (row === 0 || row === 2) {
            //console.log("kanw tin allagi kai to col einai "+col);
            col = col - 1;
        }
        /*
        if(row === 1){
          col = col - 1;
        }*/
        console.log(" you clicked on square " + row + " " + col);
        var res = getSquareWidthHeight();
        //console.log("called square eidth height width: "+res.width+" and height is "+ res.height);
        //if (type === "touchstart" && deltaFrom.row < 0 && deltaFrom.col < 0) {
        console.log("row and col is " + row + " " + col);
        if (type === "touchstart" && deltaFrom.row < 0 && deltaFrom.col < 0) {
            var curPiece = state.board[row][col];
            console.log("curPiece is " + curPiece);
            if (curPiece !== '') {
                console.log("mpike me lathos curr piece");
                deltaFrom = { row: row, col: col };
                getId(row, col);
                console.log("pawnTag is " + game.pawnTag);
                draggingPiece = document.getElementById(game.pawnTag);
                console.log("to dragging piece einai " + draggingPiece);
                if (draggingPiece) {
                    draggingPiece.style['width'] = '115%';
                    draggingPiece.style['height'] = '115%';
                    // draggingPiece.style['top'] = '10%';
                    // draggingPiece.style['left'] = '10%';
                    draggingPiece.style['position'] = 'absolute';
                }
                else {
                    console.log("wrong move again");
                }
            }
        }
        if ((deltaFrom.row > -1 && deltaFrom.col > -1) && (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup")) {
            // drag ended
            console.log(" got into touchend if and the type is " + type);
            /*if(row === 0 && row === 2){
              col = col-1;
            }*/
            deltaTo = { row: row, col: col };
            console.log(" mpika sto touchend");
            console.log("delta from row is " + deltaFrom.row + "delta from col is " + deltaFrom.col + "delta to " + deltaTo.row + " and deltato col is " + deltaTo.col);
            if (deltaFrom.row !== deltaTo.row || deltaFrom.col !== deltaTo.col) {
                console.log("mpainei mesa meta tin allagi");
                if (state.board[deltaFrom.row][deltaFrom.col] !== '') {
                    console.log("mpainei mesa meta tin allagi 2");
                    dragDoneHandler(deltaFrom, deltaTo);
                }
            }
            else {
                //deltaFrom = { row: -1, col: -1 };
                //deltaTo = { row: -1, col: -1 };
                //draggingPiece = null;
                console.log("wrong type of move");
            }
        }
        else {
        }
        if ((deltaFrom.row > -1 && deltaFrom.col > -1) && (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup")) {
            draggingPiece.style['width'] = '100%';
            draggingPiece.style['height'] = '100%';
            draggingPiece.style['position'] = 'absolute';
            deltaFrom = { row: -1, col: -1 };
            deltaTo = { row: -1, col: -1 };
            draggingPiece = null;
        }
        //}
    }
    game.handleDragEvent = handleDragEvent;
    function dragDoneHandler(deltaFrom, deltaTo) {
        var msg = "Dragged piece from " + deltaFrom.row + "*" + deltaFrom.col + " to " + deltaTo.row + "*" + deltaTo.col;
        log.info(msg);
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        if (!canMakeMove) {
            return;
        }
        // need to rotate the angle if playWhite
        try {
            getPawnId(deltaFrom.row, deltaFrom.col);
            var move = gameLogic.createMove(state.board, deltaFrom, deltaTo, lastUpdateUI.turnIndexAfterMove);
            //let move = gameLogic.createMove(state.board, pawnId,row, col, lastUpdateUI.turnIndexAfterMove);
            canMakeMove = false;
            gameService.makeMove(move);
            log.info(["Make movement from " + deltaFrom.row + "x" + deltaFrom.col + " to " + deltaTo.row + "x" + deltaTo.col]);
        }
        catch (e) {
            //log.info(["Illegal movement from " + deltaFrom.row + "x" + deltaFrom.col + " to " + deltaTo.row + "x" + deltaTo.col]);
            log.info(e);
            return;
        }
    }
    function getSquareWidthHeight() {
        var res = { width: gameArea.clientWidth / 5, height: gameArea.clientHeight / 3 };
        return res;
    }
    function getId(row, col) {
        if (state.board[row][col] && state.board[row][col] !== '') {
            game.pawnTag = state.board[row][col].charAt(0);
            //pawnTag = "rabbit";
            if (game.pawnTag === 'D') {
                game.pawnTag = state.board[row][col].charAt(1);
            }
            return true;
        }
        else {
            return false;
        }
    }
    game.getId = getId;
    function getArray(row) {
        if (row === 1) {
            return [0, 1, 2, 3, 4];
        }
        else {
            return [0, 1, 2];
        }
    }
    game.getArray = getArray;
    function getColumn(row, col) {
        if (row === 1) {
            return col;
        }
        else {
            return col + 1;
        }
    }
    game.getColumn = getColumn;
    function init() {
        console.log("Translation of 'RULES_OF_HARE_AND_HOUNDS' is " + translate('RULES_OF_HARE_AND_HOUNDS'));
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
    }
    game.init = init;
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (isComputerTurn) {
                sendComputerMove();
            }
        });
    }
    function computer() {
        var res = aiService.createComputerMove(state.board, 1);
        console.log("created computer move");
        console.log(res[1].set.value);
        return "hi";
    }
    game.computer = computer;
    function sendComputerMove() {
        console.log("turn index for computer " + turnIndex);
        gameService.makeMove(aiService.createComputerMove(state.board, turnIndex));
    }
    function updateUI(params) {
        animationEnded = false;
        lastUpdateUI = params;
        state = params.stateAfterMove;
        if (!state.board) {
            state.board = gameLogic.getInitialBoard();
        }
        canMakeMove = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        console.log("your player index " + params.yourPlayerIndex);
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        isComputerTurn = canMakeMove &&
            params.playersInfo[params.yourPlayerIndex].playerId === '';
        console.log("is the computer working? " + isComputerTurn);
        if (isComputerTurn) {
            canMakeMove = false;
            //console.log("calling send computer move");
            sendComputerMove();
        }
    }
    function getPawnId(row, col) {
        if (state.board[row][col]) {
            if (state.board[row][col].charAt(0) === 'D') {
                pawnId = +state.board[row][col].charAt(1);
            }
            else {
                pawnId = 4;
            }
        }
        else {
            console.log("You clicked on an empty space!!");
        }
    }
    game.getPawnId = getPawnId;
    function shouldShowImage(row, col) {
        var cell = state.board[row][col];
        return cell !== "";
    }
    game.shouldShowImage = shouldShowImage;
    function isPieceX(row, col) {
        return state.board[row][col] === 'X';
    }
    game.isPieceX = isPieceX;
    function isPieceO(row, col) {
        return state.board[row][col] === 'O';
    }
    game.isPieceO = isPieceO;
    function shouldSlowlyAppear(row, col) {
        return !animationEnded &&
            state.delta &&
            state.delta.row === row && state.delta.col === col;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run([function () {
        $rootScope['game'] = game;
        translate.setLanguage('en', {
            RULES_OF_HARE_AND_HOUNDS: "Rules of Hare and Hounds",
            RULES_SLIDE1: "Hare is trying to avoid the hounds and reach the other side of the board, while the hounds try to block it",
            //RULES_SLIDE1: "test help",
            RULES_SLIDE2: "All pieces can be moved one space. Hounds can not move backwards while the hare can move anywhere it wants",
            CLOSE: "Close"
        });
        game.init();
    }]);
;var aiService;
(function (aiService) {
    function createComputerMove(board, playerIndex) {
        console.log("ai has been summoned");
        if (board === undefined) {
            board = gameLogic.getInitialBoard();
        }
        var pawn = 3;
        var positions;
        var result;
        if (playerIndex === 0) {
            var dogLocations = gameLogic.getDogPositions(board);
            pawn = Math.floor(Math.random() * 3);
            console.log(" dog selected to be moved " + (pawn));
            while (dogLocations[pawn].row === 1 && dogLocations[pawn].col === 4) {
                pawn = Math.floor(Math.random() * 3);
            }
            console.log(" dog selected to be move after check " + (pawn));
            var dogRow = dogLocations[pawn].row;
            var dogCol = dogLocations[pawn].col;
            //setDogId(pawn+1);
            positions = gameLogic.legalMovesDog[dogRow][dogCol];
            //let m = positions[Math.floor(Math.random() * positions.length )];
            var m;
            while (result === undefined) {
                console.log("mpika");
                //while(m === undefined){
                m = positions[Math.floor(Math.random() * positions.length)];
                console.log(" move created by random " + m[0] + " " + m[1]);
                //}
                try {
                    result = gameLogic.createMove(board, { row: dogRow, col: dogCol }, { row: m[0], col: m[1] }, playerIndex);
                }
                catch (e) {
                }
                ;
                pawn = Math.floor(Math.random() * 3);
                //console.log(" dog selected to be moved "+ (pawn));
                while (dogLocations[pawn].row === 1 && dogLocations[pawn].col === 4) {
                    pawn = Math.floor(Math.random() * 3);
                }
                dogRow = dogLocations[pawn].row;
                dogCol = dogLocations[pawn].col;
                //setDogId(pawn+1);
                positions = gameLogic.legalMovesDog[dogRow][dogCol];
            }
            return result;
        }
        else {
            var bunnyPosition = gameLogic.getBunnyPosition(board);
            positions = gameLogic.legalMovesBunny[bunnyPosition.row][bunnyPosition.col];
            var y;
            while (result === undefined) {
                y = positions[Math.floor(Math.random() * positions.length)];
                console.log(" move created by random " + y[0] + " " + y[1]);
                try {
                    result = gameLogic.createMove(board, { row: bunnyPosition.row, col: bunnyPosition.col }, { row: y[0], col: y[1] }, playerIndex);
                }
                catch (e) {
                    console.log(e);
                }
                ;
            }
            return result;
        }
    }
    aiService.createComputerMove = createComputerMove;
    function setDogId(id) {
        aiService.dogId = id;
    }
    aiService.setDogId = setDogId;
})(aiService || (aiService = {}));
