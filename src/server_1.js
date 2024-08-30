import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Conncected to Browser ✔");

    socket.on("close", () => {
        console.log("Discconected from Browser ❌");
    });

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        switch(parsedMessage.type){
            case "message":
                sockets.forEach((asocket) => {
                    if(asocket["nickname"] == "Anonymous" || asocket["nickname"] != socket["nickname"]){
                        asocket.send(`${socket["nickname"]}: ${parsedMessage.payload.toString("utf8")}`);
                    }
                });    
                break;
            case "nickname":
                socket["nickname"] = parsedMessage.payload.toString("utf8");
                break;
        }
    });
});

server.listen(3000, handleListen);