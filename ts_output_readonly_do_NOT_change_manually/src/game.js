var game;
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
            RULES_SLIDE2: "All pieces can be moved one space. Hounds can not move backwards while the hare can move anywhere it wants",
            CLOSE: "Close"
        });
        game.init();
    }]);
