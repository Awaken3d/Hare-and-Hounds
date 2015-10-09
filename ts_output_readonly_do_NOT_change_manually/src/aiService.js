var aiService;
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
