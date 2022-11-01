const gameDataContainers = [];

function doesContainerExist(id) {
    let containerFound = false;

    for (let i = 0; i < gameDataContainers.length; i++) {
        if (gameDataContainers[i].id === id)
            containerFound = true;
    }

    return containerFound;
}

function getContainer(id) {
    for (let i = 0; i < gameDataContainers.length; i++) {
        if (gameDataContainers[i].id === id)
            return gameDataContainers[i];
    }
}

function removeContainer(id) {
    for (let i = 0; i < gameDataContainers.length; i++) {
        if (gameDataContainers[i].id === id)
            gameDataContainers.splice(i, 1);
    }
}

function checkForMovesRecieved(io, room) {
    if (getContainer(room).hostMove.x >= 0 && getContainer(room).hostMove.y >= 0 
     && getContainer(room).opponentMove.x >= 0 && getContainer(room).opponentMove.y >= 0) {
        console.log("Both players moves recieved.");

        io.in(room).emit("receive_moves", getContainer(room).hostMove, getContainer(room).opponentMove);
        getContainer(room).hostMove.x = -1;
        getContainer(room).hostMove.y = -1;
        getContainer(room).opponentMove.x = -1;
        getContainer(room).opponentMove.y = -1;
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

            if (!doesContainerExist(data.room)) {
                let dataCont = {
                    id: data.room,
                    hostName: "",
                    opponentName: "",
                    hostMove: { x: -1, y: -1 },
                    opponentMove: { x: -1, y: -1 }
                }

                gameDataContainers.push(dataCont);
            }

            if (roomSize <= 1) {
                data.role = "host";
                getContainer(data.room).hostName = data.username;
            } else if (roomSize >= 2) {
                data.role = "opponent";
                getContainer(data.room).opponentName = data.username;
            }

            console.log("Set role " + data.role);

            io.in(data.room).emit("confirm_connection", data);

            if (roomSize >= 2) {
                data.hostName = getContainer(data.room).hostName;
                data.opponentName = getContainer(data.room).opponentName;
                io.in(data.room).emit("both_connected", data);
            }
        })

        socket.on("send_move", (x, y, room, username, role, callback) => {
            console.log(`received move [${x}, ${y}] from ${username}`);

            if (role === "host") {
                getContainer(room).hostMove.x = x;
                getContainer(room).hostMove.y = y;
            }
            else if (role === "opponent") {
                getContainer(room).opponentMove.x = x;
                getContainer(room).opponentMove.y = y;
            }

            callback(`=> server received move [${x}, ${y}].`);

            checkForMovesRecieved(io, room);
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

            removeContainer(data.room);
        })

        socket.on("disconnect", (reason) => {
            console.log(socket.id + " disconnected. Reason: " + reason);
        })
    });
}