import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function getPublicRooms() {
    const {
        sockets: {
            adapter: {
                sids, rooms
            }
        }
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push([key, countRoomMembers(key)]);
        }
    });
    return publicRooms;
}

function countRoomMembers(room) {
    return wsServer.sockets.adapter.rooms.get(room)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Nameless";
    wsServer.sockets.emit("room_change", getPublicRooms());

    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    socket.on("enter_room", (room, done) => {
        socket.join(room);
        done(countRoomMembers(room));
        socket.to(room).emit("welcome", socket.nickname, countRoomMembers(room));
        wsServer.sockets.emit("room_change", getPublicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, countRoomMembers(room) - 1);
        });
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", getPublicRooms());
    })

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("nickname", (nick) => {
        socket["nickname"] = nick;
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);