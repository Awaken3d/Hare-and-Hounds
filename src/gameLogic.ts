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
        [[], [[1,0],[0,0], [1,2], [2,0]], [[0,0],[0,1],[0,2],[1,1], [1,3],[2,0],[2,1],[2,2]],
            [[1,2],[0,2], [2,2],[1,4]] , [[0,2], [1,3], [2,2]]],
        [[[1,0],[1,1], [1,2], [2,1]],[[2,0],[1,2],[2,2]], [[2,1],[1,3], [1,2],[1,4]]]];

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


export function getBunnyPosition(board:Board):BoardDelta{
  for(var i=0;i<board.length;i++){
    for(var j = 0;j<board[i].length;j++){
      if(board[i][j] === 'B'){
        return {row:i, col:j};
      }
    }
  }
}


export function getDogPositions(board:Board){
  var dogPositions:BoardDelta[] = [{row:undefined,col:undefined},{row:undefined,col:undefined},{row:undefined,col:undefined}];
  for(var i =0; i< board.length; i++){
    for(var j=0;j<board[i].length;j++){
        if(board[i][j].charAt(0) === 'D'){
          if(board[i][j].charAt(1) === '1'){

            dogPositions[0] = {row:i, col:j};
          }else if(board[i][j].charAt(1) === '2'){
            dogPositions[1] = {row:i, col:j};
          }else{
            dogPositions[2] = {row:i, col:j};
          }
        }
    }
  }
  console.log("printing dog positions");
  console.log(dogPositions[0]);
  console.log(dogPositions[1]);
  console.log(dogPositions[2]);
  return dogPositions;
}
  /*used to copy an array to another array by value to avoid assignment by reference, angular wouldn't work for me, i
  * have to take a look at it later*/

    export function arraysEqual(arr1:any, arr2:any) {
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



  function copy(arr:any){
    var new_arr = arr.slice(0);
    for(var i = arr.length; i--;)
      if(new_arr[i] instanceof Array)
        new_arr[i] = copy(arr[i]);
    return new_arr;
  }

  export function determinePawn(board: Board, deltaFrom: BoardDelta){
        var pawn:string = board[deltaFrom.row][deltaFrom.col];
        if(pawn.charAt(0) != ''){
          return pawn;
        }else{
          return '';
        }

  }

  export function getTurn(turnIndex:number){
      return (turnIndex === 0 ? 'D' : 'B');

  }
  export function createMove(
      board: Board, deltaFrom:BoardDelta, deltaTo:BoardDelta, turnIndexBeforeMove: number): IMove {
    var moveArrayFrom:number[] = [deltaFrom.row, deltaFrom.col];
    var moveArrayTo:number[] = [deltaTo.row, deltaTo.col];
    console.log(moveArrayTo);
    //console.log(" creating move to row "+row + " and col "+col );
    //console.log( "and id is "+pawnID);
    //console.log(moveArray);
    if (!board) {
      console.log(" creating new board");
      // Initially (at the beginning of the match), the board in state is undefined.
      board = getInitialBoard();
    }
    var pawn:string = determinePawn(board, deltaFrom);
      if(deltaTo.col < 0){
          throw new Error("Column value cannot be lower than 0");
      }

      if(deltaTo.row < 0){
          throw new Error("Row value cannot be lower than 0");
      }else if(deltaTo.row >2){
          throw new Error("Row value cannot be higher than 2");
      }

      if(deltaTo.row == 1 && deltaTo.col > 4 ){
          throw new Error("Column value is too high");
      }else if((deltaTo.row === 0 || deltaTo.row === 2) && deltaTo.col >2){
          throw new Error("Column value is too high");
      }

    if (board[deltaTo.row][deltaTo.col] !== '') {
      throw new Error("One can only make a move in an empty position!");
    }


    if (getWinner(board) !== '') {

      throw new Error("Can only make a move if the game is not over!");
    }

    if(pawn === ''){
      throw new Error(" the original position contained no pawn");
    }

    if(getTurn(turnIndexBeforeMove) !== pawn.charAt(0)){
      throw new Error("It is not that pawn's turn to move");
    }
    console.log(" it's the "+getTurn(turnIndexBeforeMove)+" move");
    console.log("the pawn chosen is "+ pawn.charAt(0));
    if(getTurn(turnIndexBeforeMove) === 'B'){

      console.log("nomizei oti paizei o lagos");
      var existsInLegalMoves:boolean = false;
      //for(var i in legalMovesBunny){
      for(var i=0 ; i< legalMovesBunny[deltaFrom.row][deltaFrom.col].length;i++){

        //console.log("arrays checked " + legalMovesBunny[bunnyPosition.line][bunnyPosition.column][i]);
        //console.log("value of i is "+i);

        //if(arraysEqual(moveArrayTo, legalMovesBunny[deltaFrom.row][deltaFrom.col][i])){
        if(angular.equals(moveArrayTo, legalMovesBunny[deltaFrom.row][deltaFrom.col][i])){
          existsInLegalMoves = true;

        }
      }

      if(!existsInLegalMoves){

        throw new Error("Cannot move there bunny!");
      }

    } else{
      var id:number;

      if(+pawn.charAt(1) === 1){
        id = 0;
      }else if(+pawn.charAt(1) === 2){
        id =1;
      }else if(+pawn.charAt(1) === 3){
        id = 2;
      }

      var existsInLegalMoves2:boolean = false;

       //for(var i in legalMovesDog){

       for(var i = 0;i< legalMovesDog[deltaFrom.row][deltaFrom.col].length; i++){
         console.log(legalMovesDog[deltaFrom.row][deltaFrom.col][i]);

         //console.log("value of i is "+i);
        //if(arraysEqual(moveArrayTo, legalMovesDog[deltaFrom.row][deltaFrom.col][i])){
        if(angular.equals(moveArrayTo, legalMovesDog[deltaFrom.row][deltaFrom.col][i])){
          console.log("tairiakse me kapoio");
          existsInLegalMoves2 = true;
        }
      }

      if(!existsInLegalMoves2){

        throw new Error("Cannot move there dog!");

      }


    }

    // var boardAfterMove = angular.copy(board);
    var boardAfterMove = copy(board);

    if(getTurn(turnIndexBeforeMove) === 'B'){
      boardAfterMove[deltaFrom.row][deltaFrom.col] = '';
      boardAfterMove[deltaTo.row][deltaTo.col] = 'B';
      //bunnyPosition.line = row;
      //bunnyPosition.column = col;
    }else{
      boardAfterMove[deltaFrom.row][deltaFrom.col] = '';
      boardAfterMove[deltaTo.row][deltaTo.col] = 'D'+""+(pawn.charAt(1));
      //dogPosition[pawnID-1].line = row;
      //dogPosition[pawnID-1].column = col;
    }
    incrementTurn();
    var winner = getWinner(boardAfterMove);


    var firstOperation: IOperation;
    if (winner !== '' ) {
      console.log("someone won");
      // Game over.
      firstOperation = {endMatch: {endMatchScores:
          winner === 'D' ? [1, 0] : winner === 'B' ? [0, 1] : [0, 0]}};
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
    }
    var delta: BoardDelta = {row: deltaTo.row, col: deltaTo.col};



    return [firstOperation,
      {set: {key: 'board', value: boardAfterMove}},
      {set: {key: 'deltaFrom', value: {row:deltaFrom.row, col:deltaFrom.col}}},
      { set: { key: 'deltaTo', value: { row: deltaTo.row, col: deltaTo.col } } }];
  }

//checks if the game is over
  export function getWinner(board: Board): string {
    var bunnyCol:number;
    var dogCol: number[] = [undefined, undefined, undefined];
    var bunnyPosition:BoardDelta = getBunnyPosition(board);
    //console.log( getDogPositions(board));
    var dogPositions:BoardDelta[] = getDogPositions(board);
    if(bunnyPosition.row === 1){
      bunnyCol = bunnyPosition.col - 1;
    }else{
      bunnyCol = bunnyPosition.col;
    }

    for(var i = 0; i < dogPositions.length;i++){
      if(dogPositions[i].row === 1){
        dogCol[i] = dogPositions[i].col - 1;
      }else{
        dogCol[i] = dogPositions[i].col;
      }
    }




    if(bunnyCol <= dogCol[0] && bunnyCol <= dogCol[1] && bunnyCol <= dogCol[2]){
      console.log("bunny won");
      return 'B';
    }else if(turnsTake===20){
      console.log(" more than twenty moves");
      return 'B';
    }else if(bunnyBlocked(board)){
      console.log("dog moved");
      return 'D';
    }

    return '';

  }

    export function isMoveOk(params: IIsMoveOk): boolean {
/*
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove: IState = params.stateBeforeMove;
        var deltaTest:BoardDelta = move[2].set.value;
        console.log(" delta received from emulator is "+ deltaTest.row+ " "+deltaTest.col);
        var pawnId:number = params.pawnId;
        //console.log(" pawid received from emulator is "+ pawnId);
          //console.log(" turn index before move received from emulator is "+ turnIndexBeforeMove);
          console.log(" move variable received from emulator is "+ move[1].set.value);
*/
        /*

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
        //return true;
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove: IState = params.stateBeforeMove;

   /* We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    * to verify that move is legal. */
   try {
     var deltaFrom: BoardDelta = move[2].set.value;
     console.log("delta from is "+ deltaFrom.row+" "+deltaFrom.col);
     var deltaTo: BoardDelta = move[3].set.value;
     console.log("delta to is "+ deltaTo.row+" "+deltaTo.col);
     var board = stateBeforeMove.board;
     var expectedMove = createMove(board,  deltaFrom, deltaTo,turnIndexBeforeMove);

     if (!angular.equals(move, expectedMove)) {
       return false;
     }
   } catch (e) {
     // if there are any exceptions then the move is illegal
     return false;
   }
   return true;
        //return true;
    }







}
