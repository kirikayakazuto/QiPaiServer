import * as ws from "ws"
import * as login from "./login";
let Server = new ws.Server({
    port: 5000,
});

Server.on("connection", (socket: WebSocket) => {
    socket.addEventListener("message", (event: MessageEvent) => {
        let loginReq = login.LoginPackage.LoginReq.decode(event.data);
        console.log(loginReq.toJSON());
    });
});
