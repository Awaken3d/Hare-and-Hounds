module game {
  export let testString:string = "hello";
  export function sayHello(){
      console.log(this.testString);

  };
  export function printBoard(){
    for(var i=0; i<state.board.length;i++){
      for(var j=0; j<state.board[i].length;j++){
        console.log(state.board[i][j]);
      }
    }
}

export function getId(row:number, col:number){
  if(state.board[row][col]){
    pawnTag = state.board[row][col].charAt(0);
    if(pawnTag === 'D'){
      pawnTag = state.board[row][col].charAt(1);
    }
    return true;
  }else{
    return false;
  }

}
  export let pawnTag:string; //used to determine the tag to be placed on the square in the ui
  let animationEnded = false;
  let numberOfClicks:number = 0; //counts the number of clicks to make sure that a legitimate pawn was selected to move
  let rowToMove:number;
  let colToMove:number;
  let canMakeMove = false;
  let isComputerTurn = false;
  let lastUpdateUI: IUpdateUI = null;
  let state: IState = null;
  export let isHelpModalShown: boolean = false;
  let turnIndex:number = null;
  let pawnId:number;

  export function getArray(row:number){
      if(row === 1){
        return [0,1,2,3,4];
      }else{
        return [0,1,2];
      }
    }
export function getColumn(row:number, col:number){
  if(row === 1){
    return col;
  }else{
    return col+1;
  }

}

  export function init() {
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
  }

  function animationEndedCallback() {
    $rootScope.$apply(function () {
      log.info("Animation ended");
      animationEnded = true;
      if (isComputerTurn) {
        sendComputerMove();
      }
    });
  }


  function sendComputerMove() {
    gameService.makeMove(aiService.createComputerMove(state.board, turnIndex));
  }

  function updateUI(params: IUpdateUI): void {
    animationEnded = false;
    lastUpdateUI = params;
    state = params.stateAfterMove;
    if (!state.board) {
      state.board = gameLogic.getInitialBoard();
    }
    canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
      params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      turnIndex = params.turnIndexAfterMove;
    // Is it the computer's turn?
    isComputerTurn = canMakeMove &&
        params.playersInfo[params.yourPlayerIndex].playerId === '';
    if (isComputerTurn) {
      // To make sure the player won't click something and send a move instead of the computer sending a move.
      canMakeMove = false;
      // We calculate the AI move only after the animation finishes,
      // because if we call aiService now
      // then the animation will be paused until the javascript finishes.
      if (!state.delta) {
        // This is the first move in the match, so
        // there is not going to be an animation, so
        // call sendComputerMove() now (can happen in ?onlyAIs mode)
        sendComputerMove();
      }
    }
  }

  export function cellClicked(row: number, col: number): void {
    log.info(["Clicked on cell:", row, col]);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (!canMakeMove) {
      return;
    }
    if(numberOfClicks === 0){
      if(state.board[row][col]){
      if(state.board[row][col].charAt(0) === 'D'){
        pawnId = +state.board[row][col].charAt(1);
      }else{
        pawnId = 4;
      }
      numberOfClicks++;
      }else{
        console.log("You clicked on an empty space!!");

      }
    }else{
    try {
    //  let move = gameLogic.createMove(
      //    state.board, 1,row, col, lastUpdateUI.turnIndexAfterMove);
          let move = gameLogic.createMove(
              state.board, pawnId,row, col, lastUpdateUI.turnIndexAfterMove);
              console.log("index used and sent "+ lastUpdateUI.turnIndexAfterMove);
      canMakeMove = false; // to prevent making another move
      gameService.makeMove(move);
      numberOfClicks = 0;
    } catch (e) {
      //log.info(["Cell is already full in position:", row, col]);
      log.info(e);
      return;
    }
  }
  }

  export function shouldShowImage(row: number, col: number): boolean {
    let cell = state.board[row][col];
    return cell !== "";
  }

  export function isPieceX(row: number, col: number): boolean {
    return state.board[row][col] === 'X';
  }

  export function isPieceO(row: number, col: number): boolean {
    return state.board[row][col] === 'O';
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return !animationEnded &&
        state.delta &&
        state.delta.row === row && state.delta.col === col;
  }
}

angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .run([function () {
  $rootScope['game'] = game;
  translate.setLanguage('en',  {
    RULES_OF_HARE_AND_HOUNDS: "Rules of Hare and Hounds",
    RULES_SLIDE1: "Hare is trying to avoid the hounds and reach the other side of the board, while the hounds try to block it",
    RULES_SLIDE2: "All pieces can be moved one space. Hounds can not move backwards while the hare can move anywhere it wants",
    CLOSE: "Close"
  });
  game.init();
}]);
