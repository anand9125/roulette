import { WebSocket } from "ws";
import { COINS, IncominMessage, Number, OutgoingMessages } from "./type";
import { GameManager } from "./GameManager";

let MULTIPLIER=17;

export class User {
    id:number;
    name:string;
    balance:number;
    ws:WebSocket;
    locked:number
    isAdmin:boolean
    lastWon:number 
  
    constructor(id:number,name:string,ws:WebSocket,isAdmin:boolean){
        this.ws=ws;
        this.id=id;
        this.name=name;
        this.balance=2500
        this.isAdmin=isAdmin  
        //add user handler probably comes over here so
        this.initHadlers()
        this.lastWon=0
    }
    initHadlers(){
       this.ws.on("message",(data:string)=>{
        try{
            const message :IncominMessage=JSON.parse(data)
            if(message.type==="bet"){
                GameManager.getInstance().bet(message.amount,message.number,this.id)
            }
            if(this.isAdmin && message.type==="start-game"){
                GameManager.getInstance().start();
            }
            if(this.isAdmin && message.type==="end-game"){
                GameManager.getInstance().end(message.output);
            }
            if(this.isAdmin && message.type==="stop-bets"){
                GameManager.getInstance().stopBets();
            }
        }
        catch(e){
            console.log(e)
        }
       })
    }
    flush(outPut:Number){
        if(this.lastWon==0){
            this.send({
                type:"lost",
                balance:this.balance,            
                locked:this.locked,
                outcome:outPut,
            })
        }else{
            this.send({
                wonAmount:this.lastWon,
                type:"won",
                balance:this.balance,            
                locked:this.locked,
                outcome:outPut,
            })
        }
        this.lastWon=0
    }
    bet(clientId:string,amount:COINS,betNumber:Number) {
        if(this.balance<amount){
            this.send({ 
                clientId,                  
                type: "bet-undo",
                amount,
                balance: this.balance,
                locked: this.locked,
             })
        }
        this.balance -= amount; // Deducts the bet amount from balance
        this.locked += amount;  // Moves the amount to "locked" state
        const response = GameManager.getInstance().bet(amount,betNumber,this.id);
         //now let the gamemanage knows ki bet has been done
         if(response){
            this.send({ 
                clientId,                   //every bet should have the client side id also so that user can track ki ye bet lgi h ya nhi 
                type: "bet",
                amount,
                balance: this.balance,
                locked: this.locked,
             })
         }
         else{
            this.send({ 
                clientId, //so when the user spracing the bet form the forntend they know kaun si bet ki responcse aaya h kaun si bet undo karni h kaun si nhi 
                type: "bet-undo",
                amount,
                balance: this.balance,
                locked: this.locked,
             })
         }
    }
    send(payload:OutgoingMessages){
        this.ws.send(JSON.stringify(payload))
    }
    won(amount:number,outPut:Number){
        const wonAmount = amount *(outPut===Number.Zero?MULTIPLIER*2:MULTIPLIER);
        this.balance += wonAmount;
        this.locked -= amount;
        this.lastWon = wonAmount;
    }
    lost(amount:number,outPut:Number){
        this.locked-=amount;
    }
}