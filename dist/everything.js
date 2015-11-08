var gameLogic;
(function (gameLogic) {
    //the variables below are used to trace previous dog and bunny positions
    gameLogic.legalMovesDog = [[[[0, 1], [1, 1], [1, 2]], [[0, 2], [1, 2]], [[1, 3], [1, 4]]],
        [[[0, 0], [1, 1], [2, 0]], [[0, 0], [1, 2], [2, 0]], [[0, 1], [2, 1], [0, 2], [1, 3], [2, 2]],
            [[0, 2], [2, 2], [1, 4]], []], [[[1, 1], [1, 2], [2, 1]], [[1, 2], [2, 2]], [[1, 3], [1, 4]]]];
    gameLogic.legalMovesBunny = [[[[1, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 2], [1, 2]], [[0, 1], [1, 2], [1, 3], [1, 4]]],
        [[], [[1, 0], [0, 0], [1, 2], [2, 0]], [[2, 1], [1, 1], [0, 1], [2, 1], [0, 2], [1, 3], [2, 2]],
            [[1, 2], [0, 2], [2, 2], [1, 4]], [[0, 2], [1, 3], [2, 2]]],
        [[[1, 0], [1, 1], [1, 2], [2, 1]], [[2, 0], [1, 2], [2, 2]], [[2, 1], [1, 3], [1, 4]]]];
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
    /*uses pawn id to identify which dog was chosen to move, the existence of var id is redundant since a simple
    * subtraction from pawnId can yield the same results, fix it*/
    function createMove(board, pawnID, row, col, turnIndexBeforeMove) {
        var moveArray = [row, col];
        console.log(" creating move to row " + row + " and col " + col);
        console.log("and id is " + pawnID);
        //console.log(moveArray);
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
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
        if (board[row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        if (getWinner(board) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        if (turnIndexBeforeMove === 1) {
            var existsInLegalMoves = false;
            //for(var i in legalMovesBunny){
            for (var i = 0; i < gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column].length; i++) {
                //console.log("arrays checked " + legalMovesBunny[bunnyPosition.line][bunnyPosition.column][i]);
                //console.log("value of i is "+i);
                if (arraysEqual(moveArray, gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column][i])) {
                    existsInLegalMoves = true;
                }
            }
            if (!existsInLegalMoves) {
                throw new Error("Cannot move there bunny!");
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
            var existsInLegalMoves2 = false;
            //for(var i in legalMovesDog){
            for (var i = 0; i < gameLogic.legalMovesDog[gameLogic.dogPosition[id].line][gameLogic.dogPosition[id].column].length; i++) {
                //console.log("arrays checked " + legalMovesBunny[bunnyPosition.line][bunnyPosition.column][i]);
                //console.log("value of i is "+i);
                if (arraysEqual(moveArray, gameLogic.legalMovesDog[gameLogic.dogPosition[id].line][gameLogic.dogPosition[id].column][i])) {
                    existsInLegalMoves2 = true;
                }
            }
            if (!existsInLegalMoves2) {
                throw new Error("Cannot move there dog!");
            }
        }
        // var boardAfterMove = angular.copy(board);
        var boardAfterMove = copy(board);
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
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: delta } }];
    }
    gameLogic.createMove = createMove;
    //checks if the game is over
    function getWinner(board) {
        if (gameLogic.bunnyPosition.column <= gameLogic.dogPosition[0].column &&
            gameLogic.bunnyPosition.column <= gameLogic.dogPosition[1].column &&
            gameLogic.bunnyPosition.column <= gameLogic.dogPosition[2].column) {
            return 'B';
        }
        else if (gameLogic.turnsTake === 20) {
            return 'B';
        }
        else if (bunnyBlocked(board)) {
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
  
          var pawnId:number = params.pawnId;
  
  
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
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
;var game;
(function (game) {
    game.testString = "hello";
    var animationEnded = false;
    var numberOfClicks = 0; //counts the number of clicks to make sure that a legitimate pawn was selected to move
    var rowToMove;
    var colToMove;
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
    function sayHello() {
        console.log(this.testString);
    }
    game.sayHello = sayHello;
    ;
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
        console.log(" client offset left is " + gameArea.offsetLeft);
        console.log(" client offset top is " + gameArea.offsetTop);
        var col = Math.floor(5 * x / gameArea.clientWidth);
        var row = Math.floor(3 * y / gameArea.clientHeight);
        if (row === 0 || row === 2) {
            col = col - 1;
        }
        //console.log(" you clicked on square "+col+" "+row);
        var res = getSquareWidthHeight();
        //console.log("called square eidth height width: "+res.width+" and height is "+ res.height);
        //if (type === "touchstart" && deltaFrom.row < 0 && deltaFrom.col < 0) {
        if (type === "touchstart" && deltaFrom.row < 0 && deltaFrom.col < 0) {
            var curPiece = state.board[row][col];
            //console.log("curPiece is "+curPiece);
            if (curPiece) {
                deltaFrom = { row: row, col: col };
                getId(row, col);
                //console.log("pawnTag is "+pawnTag);
                draggingPiece = document.getElementById(game.pawnTag);
                if (draggingPiece) {
                    draggingPiece.style['width'] = '115%';
                    draggingPiece.style['height'] = '115%';
                    // draggingPiece.style['top'] = '10%';
                    // draggingPiece.style['left'] = '10%';
                    draggingPiece.style['position'] = 'absolute';
                }
            }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            //console.log(" got into touchend if and the type is "+type);
            if (row === 0 && row === 2) {
                col = col - 1;
            }
            deltaTo = { row: row, col: col };
            console.log("delta to " + deltaTo.row + " and delta col is " + deltaTo.col);
            dragDoneHandler(deltaFrom, deltaTo);
        }
        else {
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
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
            var move = gameLogic.createMove(state.board, pawnId, deltaTo.row, deltaTo.col, lastUpdateUI.turnIndexAfterMove);
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
        if (state.board[row][col]) {
            game.pawnTag = state.board[row][col].charAt(0);
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
    function sendComputerMove() {
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
        console.log("is the computer working? " + isComputerTurn);
        isComputerTurn = canMakeMove &&
            params.playersInfo[params.yourPlayerIndex].playerId === '';
        if (isComputerTurn) {
            // To make sure the player won't click something and send a move instead of the computer sending a move.
            canMakeMove = false;
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            if (!state.delta) {
                // This is the first move in the match, so
                // there is not going to be an animation, so
                // call sendComputerMove() now (can happen in ?onlyAIs mode)
                sendComputerMove();
            }
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
    /*export function cellClicked(row: number, col: number): void {
      log.info(["Clicked on cell:", row, col]);
      if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
        throw new Error("Throwing the error because URL has '?throwException'");
      }
      if (!canMakeMove) {
        return;
      }
      if(numberOfClicks === 0){
        if(state.board[row][col]){
        if(state.board[row][col].charAt(0) === 'D'){
          pawnId = +state.board[row][col].charAt(1);
        }else{
          pawnId = 4;
        }
        numberOfClicks++;
        }else{
          console.log("You clicked on an empty space!!");
  
        }
      }else{
      try {
      //  let move = gameLogic.createMove(
        //    state.board, 1,row, col, lastUpdateUI.turnIndexAfterMove);
            let move = gameLogic.createMove(
                state.board, pawnId,row, col, lastUpdateUI.turnIndexAfterMove);
                console.log("index used and sent "+ lastUpdateUI.turnIndexAfterMove);
        canMakeMove = false; // to prevent making another move
        gameService.makeMove(move);
        numberOfClicks = 0;
      } catch (e) {
        //log.info(["Cell is already full in position:", row, col]);
        log.info(e);
        return;
      }
    }
  }*/
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
            RULES_SLIDE2: "All pieces can be moved one space. Hounds can not move backwards while the hare can move anywhere it wants",
            CLOSE: "Close"
        });
        game.init();
    }]);
;var aiService;
(function (aiService) {
    function setDogId(id) {
        aiService.dogId = id;
    }
    aiService.setDogId = setDogId;
    function createComputerMove(board, playerIndex) {
        var pawn = 4;
        var positions;
        var result;
        if (playerIndex === 0) {
            pawn = Math.floor(Math.random() * 3);
            setDogId(pawn + 1);
            positions = gameLogic.legalMovesDog[gameLogic.dogPosition[pawn].line][gameLogic.dogPosition[pawn].column];
            var m = positions[Math.floor(Math.random() * positions.length)];
            while (result === undefined) {
                console.log("mpika");
                m = positions[Math.floor(Math.random() * positions.length)];
                try {
                    result = gameLogic.createMove(board, pawn + 1, m[0], m[1], playerIndex);
                }
                catch (e) { }
                ;
            }
            return result;
        }
        else {
            positions = gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column];
            var y;
            while (result === undefined) {
                y = positions[Math.floor(Math.random() * positions.length)];
                try {
                    result = gameLogic.createMove(board, pawn, y[0], y[1], playerIndex);
                }
                catch (e) { }
                ;
            }
            return result;
        }
    }
    aiService.createComputerMove = createComputerMove;
})(aiService || (aiService = {}));
