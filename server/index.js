const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"],
    },
});


io.on("connection", socket => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room_code) => {
        socket.join(room_code);
    });

    socket.on("new-position", (newPosition, temp)=> {
        socket.broadcast.emit("get-new-position", (newPosition, temp))
        console.log("new-position: ", newPosition)
        console.log("turn: ", temp)
    });

    socket.on("game_data", (createInputs,room_code) => {
        socket.to(room_code).emit("recieve_game_data", createInputs)
    })

    socket.on("join_room", (room_code) => {
        socket.join(room_code);
    });


});


server.listen(3001, () => {
    console.log("SERVER IS RUNNING...");
});