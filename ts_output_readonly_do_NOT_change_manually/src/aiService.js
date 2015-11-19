var aiService;
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
