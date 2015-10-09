/*describe("In Hare and Hounds", function() {


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
    function withParam(param, boolIndicator){
        expect(gameLogic.isMoveOk(param)).toBe(boolIndicator);
    }
    function arrayCoverage(arr1, arr2, switchVar){
        expect(gameLogic.arraysEqual(arr1,arr2)).toBe(switchVar);
    }

    function winnerFunction(board, pawnWinner){
        expect(gameLogic.getWinner(board)).toBe(pawnWinner);
    }
  function expectMoveOk(turnIndexBeforeMove: number, pawnId:number, stateBeforeMove: IState, move: IMove): void {
    expectMove(turnIndexBeforeMove, pawnId,stateBeforeMove, move, true);
  }

  function expectIllegalMove(turnIndexBeforeMove: number, pawnId:number,stateBeforeMove: IState, move: IMove): void {
    expectMove(turnIndexBeforeMove, pawnId,stateBeforeMove, move, false);
  }

  it("legal initial move for first dog", function() {
      var move = gameLogic.createMove(undefined, 1,1, 1, 0);
      var params = {turnIndexBeforeMove: 0,
          pawnId:1,
          stateBeforeMove: {},
          move: move};
      expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
  });

    it("legal initial move for second dog", function() {
        var move = gameLogic.createMove(undefined, 2,1, 1, 0);
        var params = {turnIndexBeforeMove: 0,
            pawnId:2,
            stateBeforeMove: {},
            move: move};
        expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
    });

    it("legal initial move for third dog", function() {
        var move = gameLogic.createMove(undefined, 3,1, 1, 0);
        var params = {turnIndexBeforeMove: 0,
            pawnId:3,
            stateBeforeMove: {},
            move: move};
        expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
    });

    it("legal initial move for bunny", function() {
        var move = gameLogic.createMove(undefined, 2,1, 3, 1);
        var params = {turnIndexBeforeMove: 1,
            pawnId:1,
            stateBeforeMove: {},
            move: move};
        expectMoveOk(params.turnIndexBeforeMove,params.pawnId,params.stateBeforeMove,params.move);
    });

    it("illegal initial move for first dog", function() {
        expectIllegalMove(0,1,{},[undefined,undefined,{set:{key:"delta",value:{row:1, col:3}}}]);
    });

    it("illegal initial move for bunny", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:1, col:1}}}]);
    });

    it("illegal initial move of dog to another dogs position", function() {
        expectIllegalMove(0,1,{},[undefined,undefined,{set:{key:"delta",value:{row:1, col:0}}}]);
    });

    it("negative col number", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:0, col:-5}}}]);
    });

    it("negative row number", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:-1, col:2}}}]);
    });

    it("col number too large", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:1, col:5}}}]);
    });

    it("row number too larger", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:3, col:2}}}]);
    });

    it("col number too larger", function() {
        expectIllegalMove(1,1,{},[undefined,undefined,{set:{key:"delta",value:{row:0, col:3}}}]);
    });

    it("end game test", function() {
        var b = gameLogic.getInitialBoard();
        b[0][2] = b[0][0];
        b[0][0] = '';
        b[1][3] = b[1][0];
        b[1][0] = '';
        b[2][2] = b[2][0];
        b[2][0] = '';

        expectIllegalMove(0,1,{board:b},[undefined,undefined,{set:{key:"delta",value:{row:0, col:1}}}]);
    });

    it("end game test", function() {
        var b = gameLogic.getInitialBoard();
        b[0][2] = b[0][0];
        b[0][0] = '';
        b[1][2] = b[1][0];
        b[1][0] = '';
        b[2][2] = b[2][0];
        b[2][0] = '';

        expectIllegalMove(0,2,{board:b},[undefined,undefined,{set:{key:"delta",value:{row:1, col:3}}}]);
    });



    it("arraysEqual function coverage ", function() {
        arrayCoverage([],[1,2], false);
    });

    it("arraysEqual function coverage null array ", function() {
        arrayCoverage(null,[1,2], false);
    });

    it("end game test", function() {
        var b = gameLogic.getInitialBoard();
        b[0][1] = b[1][4];
        b[1][4] = '';
        b[1][1] = b[1][0];
        b[1][0] = '';
        b[0][2] = b[2][0];
        b[2][0] = '';

        expectIllegalMove(0,2,{board:b},[undefined,undefined,{set:{key:"delta",value:{row:1, col:2}}}]);
    });

    it("end game test", function() {
        var b = gameLogic.getInitialBoard();
        b[2][1] = b[1][4];
        b[1][4] = '';
        b[2][2] = b[0][0];
        b[0][0] = '';
        b[1][2] = b[1][0];
        b[1][0] = '';
        b[2][0] = b[2][0];

        expectIllegalMove(0,1,{board:b},[undefined,undefined,{set:{key:"delta",value:{row:1, col:4}}}]);
    });

    it("winning case for winner function", function() {
        var b = gameLogic.getInitialBoard();
        gameLogic.bunnyPosition.line = 1;
        gameLogic.bunnyPosition.column = 0;

        gameLogic.dogPosition[0].line = 0;
        gameLogic.dogPosition[0].column = 2;

        gameLogic.dogPosition[1].line = 2;
        gameLogic.dogPosition[1].column = 2;
        gameLogic.dogPosition[2].line = 1;
        gameLogic.dogPosition[2].column = 3;

        winnerFunction(b,'B');
    });

    it("winning case for winner function", function() {
        var b = gameLogic.getInitialBoard();
       gameLogic.turnsTake = 20;

        winnerFunction(b,'B');
    });*/
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
//});
