import { WebSocket } from "ws";
import { Number, OutgoingMessages } from "./type";
import { User } from "./User";


let ID=1;
   
export class UserManager {
   // private _user:User[] //i dont want to be itrate over the array user  should be index by ides that mean this become an object
  private _user:{[key:string]:User}={};
  private static instance: UserManager;  
  private constructor(){  //Private Constructor:Prevents direct instantiation of the class.


    }
    public static getInstance(){  //Static Method (getInstance()): Ensures that only one instance is created and returned.
        if(!this.instance){
            this.instance=new UserManager();
        }
        return this.instance;
    }
    addUser(ws:WebSocket,name:string,isAdmin:boolean){
        let id=ID;
       // this._user.push(new User( that why this become (when we are making object insted of array)
        this._user[id]=new User(
            id,
            name,
            ws,
            isAdmin
        )
        ws.on("close",()=>this.removeUser(id))
        ID++;
    }
    removeUser(id:number){
      //  this._user.filter(user=>user.id!==id)
        delete this._user[id]
    }
    /*
    * BOradcast message to all user
    * if userId is an input dont send them the message taki khud ko messge na bhej ske
    */
    broadcast(message: OutgoingMessages, id?: number) {
        Object.keys(this._user).forEach((userId) => {
            const user = this._user[userId] as User;
            if (id !== user.id) {
                user.send(message);
            }
        })
    }
    won(id:number,amount:number,outPut:Number){
     this._user[id].won(amount,outPut)

    }
    lost(id:number,amount:number,outPut:Number){
        this._user[id].lost(amount,outPut)
    }
    flush(outPut:Number){
        Object.keys(this._user).forEach((userId)=>{
            const user = this._user[userId]
            user.flush(outPut)  
        })
    }
}