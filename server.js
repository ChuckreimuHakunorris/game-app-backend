require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

const { Server } = require("socket.io");
const http = require("http");

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// protected routes
app.use(verifyJWT);
app.use("/players", require("./routes/api/players"));
app.use("/rooms", require("./routes/api/rooms"));
app.use("/game", require("./routes/api/game"));

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://castrum-tactics.netlify.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

let hostMove = {
    x: -1,
    y: -1
}

let opponentMove = {
    x: -1,
    y: -1
}

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

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        console.log(socket.id + " connected to room " + data.room);
        socket.join(data.room);
        data.socketId = socket.id;

        if (data.username === "WilliamDell")
            data.role = "host";
        else
            data.role = "opponent";

        io.in(data.room).emit("confirm_connection", data);
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

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    //app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});