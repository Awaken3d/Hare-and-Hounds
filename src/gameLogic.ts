type Board = string[][];
interface BoardDelta {
  row: number;
  col: number;
}
interface IState {
  board?: Board;
  delta?: BoardDelta;
}

module gameLogic {

  //the variables below are used to trace previous dog and bunny positions
    export var legalMovesDog: any = [[[[0,1],[1,1],[1,2]], [[0,2], [1,2]], [[1,3], [1,4]]],
        [[[0,0], [1,1], [2,0]], [[0,0], [1,2], [2,0]], [[0,1], [2,1], [0,2], [1,3],[2,2]],
            [[0,2], [2,2], [1,4]] , []],[[[1,1], [1,2], [2,1]],[[1,2], [2,2]], [[1,3], [1,4]]]];

    export var legalMovesBunny: any = [[[[1,0],[0,1],[1,1],[1,2]], [[0,0],[0,2], [1,2]], [[0,1],[1,2],[1,3], [1,4]]],
        [[], [[0,0], [1,2], [2,0]], [[0,0],[2,1],[1,1],[0,1], [2,1], [0,2], [1,3],[2,2]],
            [[1,2],[0,2], [2,2], [1,4]] , [[0,2], [1,3], [2,2]]],
        [[[1,0],[1,1], [1,2], [2,1]],[[2,0],[1,2],[2,2]], [[2,1],[1,3], [1,4]]]];

    export interface playerPosition{
        line:number;
        column:number;
    }
    export var bunnyPosition:playerPosition = {line:0,column:0};
    export var dogPosition:playerPosition[] = [{line:0,column:0},{line:0,column:0},{line:0,column:0}];
  /** sets initial positions for the bunny and the dogs */
  export function setInitialPositions():void{
    bunnyPosition.line = 1;
    bunnyPosition.column = 4;
    dogPosition[0].line = 0;
    dogPosition[0].column = 0;
    dogPosition[1].line = 1;
    dogPosition[1].column = 0;
    dogPosition[2].line = 2;
    dogPosition[2].column = 0;


  }
  //counts the number of turns taken by both players, if it exceeds 20 the game is over and the bunny wins
  export var turnsTake:number = 0;
  export function incrementTurn(){
    this.turnsTake++;
  }

  /** Returns the initial Hare and Hounds board, which is a 2d matrix  */
  export function getInitialBoard(): Board {

    setInitialPositions();
    return [['D1', '', ''],
      ['D2','', '', '', 'B'],
      ['D3', '', '']];
  }
  /*hounds can only win if they corner the bunny in the initial position or in the middle of the first and last row
  (though the latter positions are really hard to achieve)*/
  export function bunnyBlocked(board:Board):boolean{

    if((board[1][4]=='B' && board[0][2].charAt(0) == 'D' && board[1][3].charAt(0) == 'D' && board[2][2].charAt(0) == 'D')||
        board[0][1]=='B' && board[0][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[0][2].charAt(0) == 'D'||
        board[2][1]=='B' && board[2][0].charAt(0) == 'D' && board[1][2].charAt(0) == 'D' && board[2][2].charAt(0) == 'D'){

      return true;
    }else {
      return false;
    }
  }

  /*used to copy an array to another array by value to avoid assignment by reference, angular wouldn't work for me, i
  * have to take a look at it later*/

    export function arraysEqual(arr1, arr2) {
        if(arr1 == null || arr2 == null){
            return false;
        }
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
    }



  function copy(arr){
    var new_arr = arr.slice(0);
    for(var i = arr.length; i--;)
      if(new_arr[i] instanceof Array)
        new_arr[i] = copy(arr[i]);
    return new_arr;
  }
  /*uses pawn id to identify which dog was chosen to move, the existence of var id is redundant since a simple
  * subtraction from pawnId can yield the same results, fix it*/
  export function createMove(
      board: Board,pawnID:number, row: number , col: number, turnIndexBeforeMove: number): IMove {
    var moveArray:number[] = [row, col];

    if (!board) {
      // Initially (at the beginning of the match), the board in state is undefined.
      board = getInitialBoard();
    }

      if(col < 0){
          throw new Error("Column value cannot be lower than 0");
      }

      if(row < 0){
          throw new Error("Row value cannot be lower than 0");
      }else if(row >2){
          throw new Error("Row value cannot be higher than 2");
      }

      if(row == 1 && col > 4 ){
          throw new Error("Column value is too high");
      }else if((row === 0 || row === 2) && col >2){
          throw new Error("Column value is too high");
      }

    if (board[row][col] !== '') {
      throw new Error("One can only make a move in an empty position!");
    }


    if (getWinner(board) !== '') {

      throw new Error("Can only make a move if the game is not over!");
    }


    if(turnIndexBeforeMove === 1){


      var existsInLegalMoves:boolean = false;
      for(var i in legalMovesBunny){
        if(arraysEqual(moveArray, legalMovesBunny[bunnyPosition.line][bunnyPosition.column][i])){
          existsInLegalMoves = true;
        }
      }

      if(!existsInLegalMoves){

        throw new Error("Cannot move there bunny!");
      }

    }else{
      var id:number;

      if(pawnID == 1){
        id = 0;
      }else if(pawnID == 2){
        id =1;
      }else{
        id = 2;
      }

      var existsInLegalMoves2:boolean = false;

       for(var i in legalMovesDog){
        if(arraysEqual(moveArray, legalMovesDog[dogPosition[id].line][dogPosition[id].column][i])){

          existsInLegalMoves2 = true;
        }
      }

      if(!existsInLegalMoves2){

        throw new Error("Cannot move there dog!");

      }


    }

    // var boardAfterMove = angular.copy(board);
    var boardAfterMove = copy(board);

    if(turnIndexBeforeMove === 1){
      boardAfterMove[bunnyPosition.line][bunnyPosition.column] = '';
      boardAfterMove[row][col] = 'B';
      bunnyPosition.line = row;
      bunnyPosition.column = col;
    }else{
      boardAfterMove[dogPosition[pawnID-1].line][dogPosition[pawnID-1].column] = '';
      boardAfterMove[row][col] = 'D'+""+(pawnID);
      dogPosition[pawnID-1].line = row;
      dogPosition[pawnID-1].column = col;
    }
    var winner = getWinner(boardAfterMove);


    var firstOperation: IOperation;
    if (winner !== '' ) {

      // Game over.
      firstOperation = {endMatch: {endMatchScores:
          winner === 'D' ? [1, 0] : winner === 'B' ? [0, 1] : [0, 0]}};
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
    }
    var delta: BoardDelta = {row: row, col: col};



    return [firstOperation,
      {set: {key: 'board', value: boardAfterMove}},
      {set: {key: 'delta', value: delta}}];
  }
//checks if the game is over
  export function getWinner(board: Board): string {

    if(bunnyPosition.column <= dogPosition[0].column &&
        bunnyPosition.column <= dogPosition[1].column &&
        bunnyPosition.column <= dogPosition[2].column){
      return 'B';
    }else if(turnsTake===20){
      return 'B';
    }else if(bunnyBlocked(board)){

      return 'D';
    }

    return '';

  }

    export function isMoveOk(params: IIsMoveOk): boolean {
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
        incrementTurn();
        return true;
    }







}
