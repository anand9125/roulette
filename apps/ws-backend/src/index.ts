import { WebSocketServer } from 'ws';
import { UserManager } from './UserManager';
require('dotenv').config();
const wss = new WebSocketServer({ port: 8080 });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
wss.on('connection', function connection(ws,request) {

   const url = request.url;
   const queryParams = new URLSearchParams(url.split('?')[1]);
   const name = queryParams.get('name');
   console.log(name)
   console.log(ADMIN_PASSWORD)
  UserManager.getInstance().addUser(ws,name,name == ADMIN_PASSWORD);

  ws.on('error', console.error);


  ws.send('something');
});