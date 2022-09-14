const playersDB = {
    players: require("../model/players.json"),
    setPlayers: function (data) { this.players = data }
}

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
    // On client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in DB?
    const foundPlayer = playersDB.players.find(user => user.refreshToken === refreshToken);

    if (!foundPlayer) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204);
    }

    // Delete the refresh token in DB
    const otherPlayers = playersDB.players.filter(user => user.refreshToken !== foundPlayer.refreshToken);
    const currentPlayer = {...foundPlayer, refreshToken: ""};

    playersDB.setPlayers([...otherPlayers, currentPlayer]);

    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "players.json"),
        JSON.stringify(playersDB.players)
    );

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };