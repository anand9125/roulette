export type IncominMessage={
    type:"bet",
    amount:number,
    number:Number,
    clientId:string
}|{
    type :"start-game",
}|{
    type:"end-game",
    output:number
}|{
    type:"stop-bets"
}

export type OutgoingMessages={
    type:"current-state",
    state:GameState
}|
{
    type:"bet",
    clientId:string,
    amount:number,
    balance:number,
    locked:number,
} | {
    type:"bet-undo",
    clientId:string,
    amount:number,
    balance:number,
    locked:number,
    
} | {
    type:"won",
    balance:number,
    locked:number,
    wonAmount:number,
    outcome:number

} | {
    type:"lost",
    balance:number,
    locked:number,
    outcome:number
}|{
    type :"start-game",
}|{
    type:"end-game",
    output:number
}|{
    type:"stop-bets"
}

export enum COINS {
    One =1,
    Five=5,
    Ten=10,
    Twenty=20,
    Fifty=50,
    Hundred=100,
    TwoHundredFifty=250,
    FiveHundred=500,
}
export enum Number{
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve,
    Thirteen,
    Fourteen,
    Fifteen,
    Sixteen,
    Seventeen,
    Eighteen,
    Nineteen,
    Twenty,
    TwentyOne,
    TwentyTwo,
    TwentyThree,
    TwentyFour,
    TwentyFive,
    TwentySix,
    TwentySeven,
    TwentyEight,
    TwentyNine,
    Thirty,
    ThirtyOne,
    ThirtyTwo,
    ThirtyThree,
    ThirtyFour,
    ThirtyFive,
} 

export enum GameState{
  CanBet,
  CantBet,
  GameOver
}


export type Bet = {
    id:number,
    amount:number
    number:Number

}