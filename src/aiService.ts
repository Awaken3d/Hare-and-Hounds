
module aiService {

  /** Returns the move that the computer player should do for the given updateUI. */
  /*export function findComputerMove(updateUI: IUpdateUI): IMove {
    return createComputerMove(
        updateUI.stateAfterMove.board,
        updateUI.pawnId,
        updateUI.turnIndexAfterMove,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000})
  }*/


export let dogId:number;

export function setDogId(id:number){
  dogId = id;
}

export function createComputerMove(
    board: Board, playerIndex: number){
      console.log("ai has been summoned");
      let pawn = 3;
      let positions:any;
      let result:any ;
      if(playerIndex === 0){
        pawn = Math.floor(Math.random() * 3 );
        console.log(" dog selected to be moved "+ (pawn));
        while(gameLogic.dogPosition[pawn].line === 1 && gameLogic.dogPosition[pawn].column === 4){
          pawn = Math.floor(Math.random() * 3 );
        }
        console.log(" dog selected to be move after check "+ (pawn));
        setDogId(pawn+1);
        positions = gameLogic.legalMovesDog[gameLogic.dogPosition[pawn].line][gameLogic.dogPosition[pawn].column];
        //let m = positions[Math.floor(Math.random() * positions.length )];
        let m:number[];
        while(result === undefined){
          console.log("mpika");
          //while(m === undefined){
          m = positions[Math.floor(Math.random() * positions.length )];
          console.log(" move created by random "+ m[0] + " "+m[1]);
          //}
          try{
          result = gameLogic.createMove(board, pawn+1, m[0], m[1], playerIndex);
        }catch(e){
          //console.log(e);
        };
        pawn = Math.floor(Math.random() * 3 );
        //console.log(" dog selected to be moved "+ (pawn));
        while(gameLogic.dogPosition[pawn].line === 1 && gameLogic.dogPosition[pawn].column === 4){
          pawn = Math.floor(Math.random() * 3 );
        }
        setDogId(pawn+1);
        positions = gameLogic.legalMovesDog[gameLogic.dogPosition[pawn].line][gameLogic.dogPosition[pawn].column];
        }
        return result;

      }else{
        positions = gameLogic.legalMovesBunny[gameLogic.bunnyPosition.line][gameLogic.bunnyPosition.column];
        let y:any;
        while(result === undefined){
          y = positions[Math.floor(Math.random() * positions.length )];
          console.log(" move created by random "+ y[0] + " "+y[1]);
          try{
            result = gameLogic.createMove(board, pawn, y[0], y[1], playerIndex);
        }catch(e){};
      }

        return  result;
      }



}

}
