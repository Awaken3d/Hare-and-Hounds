var aiService;
(function (aiService) {
    function setDogId(id) {
        aiService.dogId = id;
    }
    aiService.setDogId = setDogId;
    function createComputerMove(board, playerIndex) {
        console.log("ai has been summoned");
        var pawn = 3;
        var positions;
        var result;
        if (playerIndex === 0) {
            pawn = Math.floor(Math.random() * 3);
            console.log(" dog selected to be moved " + (pawn));
            while (gameLogic.dogPosition[pawn].line === 1 && gameLogic.dogPosition[pawn].column === 4) {
                pawn = Math.floor(Math.random() * 3);
            }
            console.log(" dog selected to be move after check " + (pawn));
            setDogId(pawn + 1);
            positions = gameLogic.legalMovesDog[gameLogic.dogPosition[pawn].line][gameLogic.dogPosition[pawn].column];
            //let m = positions[Math.floor(Math.random() * positions.length )];
            var m;
            while (result === undefined) {
                console.log("mpika");
                //while(m === undefined){
                m = positions[Math.floor(Math.random() * positions.length)];
                console.log(" move created by random " + m[0] + " " + m[1]);
                //}
                try {
                    result = gameLogic.createMove(board, pawn + 1, m[0], m[1], playerIndex);
                }
                catch (e) {
                }
                ;
                pawn = Math.floor(Math.random() * 3);
                //console.log(" dog selected to be moved "+ (pawn));
                while (gameLogic.dogPosition[pawn].line === 1 && gameLogic.dogPosition[pawn].column === 4) {
                    pawn = Math.floor(Math.random() * 3);
                }
                setDogId(pawn + 1);
                positions = gameLogic.legalMovesDog[gameLogic.dogPosition[pawn].line][gameLogic.dogPosition[pawn].column];
            }
            return result;
        }
        else {
            positions = gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column];
            var y;
            while (result === undefined) {
                y = positions[Math.floor(Math.random() * positions.length)];
                console.log(" move created by random " + y[0] + " " + y[1]);
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
