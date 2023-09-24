const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});


io.on("connection", socket => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room_code) => {
        socket.join(room_code);
    });

    socket.on("new-position", (newPosition, temp, moves)=> {
        socket.broadcast.emit("get-new-position", newPosition, temp, moves)
        console.log("new-position: ", newPosition)
        console.log("turn: ", temp)
        console.log("move: ", moves)
    });

    socket.on("game_data", (createInputs, addr1) => {
        socket.broadcast.emit("recieve_game_data", createInputs, addr1)
        console.log("creator inputs: ", createInputs)
        console.log("adddress: ", addr1)
    })

    socket.on("room_joined", (roomJoined, room_code) => {
        socket.to(room_code).emit("room_joined", roomJoined)
        console.log(roomJoined);
    })


});


server.listen(3001, () => {
    console.log("SERVER IS RUNNING...");
});