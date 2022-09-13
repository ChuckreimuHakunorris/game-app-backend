const express = require("express");
const app = express();
const path = require('path');
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page", (req, res) => {
    res.redirect(301, "new-page");
});

app.get("/*", (req, res) => {
    res.status(404).appendsendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));