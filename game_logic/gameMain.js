let hostMove = {
    x: -1,
    y: -1
}

let opponentMove = {
    x: -1,
    y: -1
}

let hostName = "";
let opponentName = "";

function checkForMovesRecieved() {
    if (hostMove.x >= 0 && hostMove.y >= 0 && opponentMove.x >= 0 && opponentMove.y >= 0) {
        console.log("Both players moves recieved.");

        io.in(1).emit("receive_moves", hostMove, opponentMove);
        hostMove.x = -1;
        hostMove.y = -1;
        opponentMove.x = -1;
        opponentMove.y = -1;
    }
}

exports = module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            console.log(socket.id + " connected to room " + data.room);
            socket.join(data.room);
            data.socketId = socket.id;

            roomSize = io.sockets.adapter.rooms.get(data.room).size;

            if (roomSize <= 1) {
                data.role = "host";
                hostName = data.username;
            } else if (roomSize >= 2) {
                data.role = "opponent";
                opponentName = data.username;
            }

            io.in(data.room).emit("confirm_connection", data);

            if (roomSize >= 2) {
                data.hostName = hostName;
                data.opponentName = opponentName;
                io.in(data.room).emit("both_connected", data);
            }
        })

        socket.on("send_move", (x, y, room, username, role, callback) => {
            console.log(`received move [${x}, ${y}] from ${username}`);

            if (role === "host") {
                hostMove.x = x;
                hostMove.y = y;
            }
            else if (role === "opponent") {
                opponentMove.x = x;
                opponentMove.y = y;
            }

            callback(`=> server received move [${x}, ${y}].`);

            checkForMovesRecieved();
        })

        socket.on("send_message", (data) => {
            console.log(socket.id + ": '" + data.message + "' to room " + data.room);
            data.socketId = socket.id;
            io.in(data.room).emit("receive_message", data);
        })

        socket.on("send_game_end", (data) => {
            console.log(socket.id + ": GAME END to room " + data.room);
            data.socketId = socket.id;
            socket.broadcast.to(data.room).emit("receive_game_end", data);
        })

        socket.on("disconnect", (reason) => {
            console.log(socket.id + " disconnected. Reason: " + reason);
        })
    });
}