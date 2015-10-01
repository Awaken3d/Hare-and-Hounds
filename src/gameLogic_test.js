describe("In Hare and Hounds", function () {
    function expectMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move, isOk) {
        expect(gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            pawnId: pawnId,
            turnIndexAfterMove: null,
            stateBeforeMove: stateBeforeMove,
            move: move
        })).toBe(isOk);
    }
    function withParam(param, boolIndicator) {
        expect(gameLogic.isMoveOk(param)).toBe(boolIndicator);
    }
    function arrayCoverage(arr1, arr2, switchVar) {
        expect(gameLogic.arraysEqual(arr1, arr2)).toBe(switchVar);
    }
    function winnerFunction(board, pawnWinner) {
        expect(gameLogic.getWinner(board)).toBe(pawnWinner);
    }
    function expectMoveOk(turnIndexBeforeMove, pawnId, stateBeforeMove, move) {
        expectMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move, true);
    }
    function expectIllegalMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move) {
        expectMove(turnIndexBeforeMove, pawnId, stateBeforeMove, move, false);
    }
    it("legal initial move for first dog", function () {
        var move = gameLogic.createMove(undefined, 1, 1, 1, 0);
        var params = { turnIndexBeforeMove: 0, pawnId: 1, stateBeforeMove: {}, move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
    it("legal initial move for second dog", function () {
        var move = gameLogic.createMove(undefined, 2, 1, 1, 0);
        var params = { turnIndexBeforeMove: 0, pawnId: 2, stateBeforeMove: {}, move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
    it("legal initial move for third dog", function () {
        var move = gameLogic.createMove(undefined, 3, 1, 1, 0);
        var params = { turnIndexBeforeMove: 0, pawnId: 3, stateBeforeMove: {}, move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
    it("legal initial move for bunny", function () {
        var move = gameLogic.createMove(undefined, 2, 1, 3, 1);
        var params = { turnIndexBeforeMove: 1, pawnId: 1, stateBeforeMove: {}, move: move };
        expectMoveOk(params.turnIndexBeforeMove, params.pawnId, params.stateBeforeMove, params.move);
    });
    it("illegal initial move for first dog", function () {
        expectIllegalMove(0, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 3 } } }]);
    });
    it("illegal initial move for bunny", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 1 } } }]);
    });
    it("illegal initial move of dog to another dogs position", function () {
        expectIllegalMove(0, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 0 } } }]);
    });
    it("negative col number", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 0, col: -5 } } }]);
    });
    it("negative row number", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: -1, col: 2 } } }]);
    });
    it("col number too large", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 5 } } }]);
    });
    it("row number too larger", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 3, col: 2 } } }]);
    });
    it("col number too larger", function () {
        expectIllegalMove(1, 1, {}, [undefined, undefined, { set: { key: "delta", value: { row: 0, col: 3 } } }]);
    });
    it("end game test", function () {
        var b = gameLogic.getInitialBoard();
        b[0][2] = b[0][0];
        b[0][0] = '';
        b[1][3] = b[1][0];
        b[1][0] = '';
        b[2][2] = b[2][0];
        b[2][0] = '';
        expectIllegalMove(0, 1, { board: b }, [undefined, undefined, { set: { key: "delta", value: { row: 0, col: 1 } } }]);
    });
    it("end game test", function () {
        var b = gameLogic.getInitialBoard();
        b[0][2] = b[0][0];
        b[0][0] = '';
        b[1][2] = b[1][0];
        b[1][0] = '';
        b[2][2] = b[2][0];
        b[2][0] = '';
        expectIllegalMove(0, 2, { board: b }, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 3 } } }]);
    });
    it("arraysEqual function coverage ", function () {
        arrayCoverage([], [1, 2], false);
    });
    it("arraysEqual function coverage null array ", function () {
        arrayCoverage(null, [1, 2], false);
    });
    it("end game test", function () {
        var b = gameLogic.getInitialBoard();
        b[0][1] = b[1][4];
        b[1][4] = '';
        b[1][1] = b[1][0];
        b[1][0] = '';
        b[0][2] = b[2][0];
        b[2][0] = '';
        expectIllegalMove(0, 2, { board: b }, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 2 } } }]);
    });
    it("end game test", function () {
        var b = gameLogic.getInitialBoard();
        b[2][1] = b[1][4];
        b[1][4] = '';
        b[2][2] = b[0][0];
        b[0][0] = '';
        b[1][2] = b[1][0];
        b[1][0] = '';
        b[2][0] = b[2][0];
        expectIllegalMove(0, 1, { board: b }, [undefined, undefined, { set: { key: "delta", value: { row: 1, col: 4 } } }]);
    });
    it("winning case for winner function", function () {
        var b = gameLogic.getInitialBoard();
        gameLogic.bunnyPosition.line = 1;
        gameLogic.bunnyPosition.column = 0;
        gameLogic.dogPosition[0].line = 0;
        gameLogic.dogPosition[0].column = 2;
        gameLogic.dogPosition[1].line = 2;
        gameLogic.dogPosition[1].column = 2;
        gameLogic.dogPosition[2].line = 1;
        gameLogic.dogPosition[2].column = 3;
        winnerFunction(b, 'B');
    });
    it("winning case for winner function", function () {
        var b = gameLogic.getInitialBoard();
        gameLogic.turnsTake = 20;
        winnerFunction(b, 'B');
    });
    /* it("end game test", function() {
         var b = gameLogic.getInitialBoard();
         b[2][1] = b[1][4];
         b[1][4] = '';
         b[2][2] = b[0][0];
         b[0][0] = '';
         b[1][1] = b[1][0];
         b[1][0] = '';
         //b[2][0] = b[2][0];
         gameLogic.bunnyPosition.line = 2;
         gameLogic.bunnyPosition.column = 1;
 
         gameLogic.dogPosition[0].line = 2;
         gameLogic.dogPosition[0].column = 2;
 
         gameLogic.dogPosition[1].line = 1;
         gameLogic.dogPosition[1].column = 1;
         gameLogic.dogPosition[2].line = 2;
         gameLogic.dogPosition[2].column = 0;
 
         //var move = gameLogic.createMove(b, 2,1, 2, 0);
         //console.log("move=", move);
         var params:IIsMoveOk = {turnIndexBeforeMove: 0,
             pawnId:2,
             stateBeforeMove: {board:b},
             move: [undefined,undefined,{set:{key:"delta",value:{row:1, col:2}}}]};
 
 
         //expectIllegalMove(params.turnIndexBeforeMove,params.pawnId,{stateBeforeMove:params.stateBeforeMove},params.move);
         withParam(params,true);
     });*/
    /*
      it("placing O in 0x1 after X placed X in 0x0 is legal", function() {
        expectMoveOk(1,
          {board:
            [['X', '', ''],
             ['', '', ''],
             ['', '', '']], delta: {row: 0, col: 0}},
          [{setTurn: {turnIndex : 0}},
            {set: {key: 'board', value:
              [['X', 'O', ''],
               ['', '', ''],
               ['', '', '']]}},
            {set: {key: 'delta', value: {row: 0, col: 1}}}]);
      });

      it("placing an O in a non-empty position is illegal", function() {
        expectIllegalMove(1,
          {board:
            [['X', '', ''],
             ['', '', ''],
             ['', '', '']], delta: {row: 0, col: 0}},
          [{setTurn: {turnIndex : 0}},
            {set: {key: 'board', value:
              [['O', '', ''],
               ['', '', ''],
               ['', '', '']]}},
            {set: {key: 'delta', value: {row: 0, col: 0}}}]);
      });

      it("cannot move after the game is over", function() {
        expectIllegalMove(1,
          {board:
            [['X', 'O', ''],
             ['X', 'O', ''],
             ['X', '', '']], delta: {row: 2, col: 0}},
          [{setTurn: {turnIndex : 0}},
            {set: {key: 'board', value:
              [['X', 'O', ''],
               ['X', 'O', ''],
               ['X', 'O', '']]}},
            {set: {key: 'delta', value: {row: 2, col: 1}}}]);
      });

      it("placing O in 2x1 is legal", function() {
        expectMoveOk(1,
          {board:
            [['O', 'X', ''],
             ['X', 'O', ''],
             ['X', '', '']], delta: {row: 2, col: 0}},
          [{setTurn: {turnIndex : 0}},
            {set: {key: 'board', value:
              [['O', 'X', ''],
               ['X', 'O', ''],
               ['X', 'O', '']]}},
            {set: {key: 'delta', value: {row: 2, col: 1}}}]);
      });

      it("X wins by placing X in 2x0 is legal", function() {
        expectMoveOk(0,
          {board:
            [['X', 'O', ''],
             ['X', 'O', ''],
             ['', '', '']], delta: {row: 1, col: 1}},
          [{endMatch: {endMatchScores: [1, 0]}},
                {set: {key: 'board', value:
                  [['X', 'O', ''],
                   ['X', 'O', ''],
                   ['X', '', '']]}},
                {set: {key: 'delta', value: {row: 2, col: 0}}}]);
      });

      it("O wins by placing O in 1x1 is legal", function() {
        expectMoveOk(1,
          {board:
            [['X', 'X', 'O'],
             ['X', '', ''],
             ['O', '', '']], delta: {row: 0, col: 1}},
          [{endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                  [['X', 'X', 'O'],
                   ['X', 'O', ''],
                   ['O', '', '']]}},
                {set: {key: 'delta', value: {row: 1, col: 1}}}]);
      });

      it("the game ties when there are no more empty cells", function() {
        expectMoveOk(0,
          {board:
            [['X', 'O', 'X'],
             ['X', 'O', 'O'],
             ['O', 'X', '']], delta: {row: 2, col: 0}},
          [{endMatch: {endMatchScores: [0, 0]}},
                {set: {key: 'board', value:
                  [['X', 'O', 'X'],
                   ['X', 'O', 'O'],
                   ['O', 'X', 'X']]}},
                {set: {key: 'delta', value: {row: 2, col: 2}}}]);
      });

      it("null move is illegal", function() {
        expectIllegalMove(0, {}, null);
      });

      it("move without board is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
      });

      it("move without delta is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value:
            [['X', '', ''],
             ['', '', ''],
             ['', '', '']]}}]);
      });

      it("placing X outside the board (in 3x0) is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value:
            [['X', '', ''],
             ['', '', ''],
             ['', '', '']]}},
          {set: {key: 'delta', value: {row: 3, col: 0}}}]);
      });

      it("placing X in 0x0 but setTurn to yourself is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 0}},
          {set: {key: 'board', value:
            [['X', '', ''],
             ['', '', ''],
             ['', '', '']]}},
          {set: {key: 'delta', value: {row: 0, col: 0}}}]);
      });

      it("placing X in 0x0 but setting the board wrong is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value:
            [['X', 'X', ''],
             ['', '', ''],
             ['', '', '']]}},
          {set: {key: 'delta', value: {row: 0, col: 0}}}]);
      });

      it("getPossibleMoves returns exactly one cell", function() {
        var board =
            [['O', 'O', 'X'],
             ['X', 'X', 'O'],
             ['O', 'X', '']];
        var possibleMoves = gameLogic.getPossibleMoves(board, 0);
        var expectedMove = [{endMatch: {endMatchScores: [0, 0]}},
            {set: {key: 'board', value:
              [['O', 'O', 'X'],
               ['X', 'X', 'O'],
               ['O', 'X', 'X']]}},
            {set: {key: 'delta', value: {row: 2, col: 2}}}];
        expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
      });*/
});
//# sourceMappingURL=gameLogic_test.js.map