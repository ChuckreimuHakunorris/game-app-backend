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
const Room = require("./model/Room");

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

let gameMain = require("./game_logic/gameMain")(io);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    //app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

Room.collection.drop();