import { Bet, GameState, Number } from "./type";
import { UserManager } from "./UserManager";

export class GameManager {
    state:GameState = GameState.GameOver
    bets:Bet[]=[];
    private static instance: GameManager;
    private constructor(){}
    private lastWinner:Number=Number.Zero

    public static getInstance(){
        if(!this.instance){
            this.instance=new GameManager();
        }
        return this.instance;
    }
    //end user will call this
   public bet(amount:number,betNumber:Number,id:number ){
    if(this.state===GameState.CanBet){
        this.bets.push({id,amount,number:betNumber})
        return true  
    }
  }

  //only admin can call this
  public start (){
    this.state=GameState.CanBet;
    UserManager.getInstance().broadcast({
      type:"start-game",
    });

    
  }
  public stopBets(){
    this.state=GameState.CantBet;
    UserManager.getInstance().broadcast({
      type:"stop-bets",
    })
  }
  //a function will take final output as input this will be final result
  public end(outPut:Number){
    //probably we should be cached as well 
      this.lastWinner=outPut;
      this.bets.forEach(bet=>{
        if(bet.number===outPut){
            UserManager.getInstance().won(bet.id,bet.amount,outPut);
      }
      else{
          UserManager.getInstance().lost(bet.id,bet.amount,outPut);
      }
     })
    this.state=GameState.GameOver;
    this.lastWinner=outPut
    UserManager.getInstance().flush(outPut);
  }
}