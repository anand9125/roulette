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
    public bet(amount: number, betNumber: Number, id: number): boolean {
       console.log(this.state)
       console.log(id,amount,betNumber)
      if (this.state === GameState.CanBet) {
          this.bets.push({ id, amount, number: betNumber });
          console.log("i am reached here")
          console.log(this.bets)
          return true;
      }
      return false
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
  public end(output: Number) {
    this.lastWinner = output;
    console.log("hiiiiiiiiiiiiiiiiii",output)
    console.log(this.bets);
    this.bets.forEach(bet => {
        if (bet.number === output) {
          console.log("yes you won")
            UserManager.getInstance().won(bet.id, bet.amount, output);
        } else {
            UserManager.getInstance().lost(bet.id, bet.amount, output);
        }
    });

    this.state = GameState.GameOver;
    this.lastWinner = output;
    UserManager.getInstance().flush(output);
    this.bets  = []
}

}