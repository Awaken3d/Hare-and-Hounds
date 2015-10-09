describe("In TicTacToe", function() {

  function expectMove(
      turnIndexBeforeMove: number,pawnId:number, stateBeforeMove: IState, move: IMove, isOk: boolean): void {
      expect(gameLogic.isMoveOk({
          turnIndexBeforeMove: turnIndexBeforeMove,
          pawnId: pawnId,
          turnIndexAfterMove: null,
          stateBeforeMove: stateBeforeMove,
          move: move,
      })).toBe(isOk);
  }

  function expectMoveOk(turnIndexBeforeMove: number, pawnId:number, stateBeforeMove: IState, move: IMove): void {
    expectMove(turnIndexBeforeMove, pawnId,stateBeforeMove, move, true);
  }

  it("legal initial move of dog by ai", function() {
      let b:Board = gameLogic.getInitialBoard();
      var move = aiService.createComputerMove(b, 0);
      var params = {turnIndexBeforeMove: 0,
          pawnId: aiService.dogId,
          stateBeforeMove: b,
          move: move};
      expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
  });

  it("legal initial move of bunny by ai", function() {
      let b:Board = gameLogic.getInitialBoard();
      var move = aiService.createComputerMove(b, 1);
      var params = {turnIndexBeforeMove: 1,
          pawnId: aiService.dogId,
          stateBeforeMove: b,
          move: move};
      expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
  });


});
