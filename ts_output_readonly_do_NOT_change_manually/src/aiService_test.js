describe("In TicTacToe", function () {
    function expectMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move, isOk) {
        expect(gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            pawnId: pawnId,
            turnIndexAfterMove: null,
            stateBeforeMove: stateBeforeMove,
            move: move,
        })).toBe(isOk);
    }
    function expectMoveOk(turnIndexBeforeMove, pawnId, stateBeforeMove, move) {
        expectMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move, true);
    }
    it("legal initial move of dog by ai", function () {
        var b = gameLogic.getInitialBoard();
        var move = aiService.createComputerMove(b, 0);
        var params = { turnIndexBeforeMove: 0,
            pawnId: aiService.dogId,
            stateBeforeMove: b,
            move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
    it("legal initial move of bunny by ai", function () {
        var b = gameLogic.getInitialBoard();
        var move = aiService.createComputerMove(b, 1);
        var params = { turnIndexBeforeMove: 1,
            pawnId: aiService.dogId,
            stateBeforeMove: b,
            move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
});
