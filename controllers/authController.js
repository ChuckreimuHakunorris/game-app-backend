const playersDB = {
    players: require("../model/players.json"),
    setPlayers: function (data) { this.players = data }
}
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
    const { player, pwd } = req.body;

    if (!player || !pwd) return res.status(400).json({
        "message": "Username and password are required."
    });

    const foundPlayer = playersDB.players.find(user => user.username === player);

    if (!foundPlayer) return res.sendStatus(401); // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundPlayer.password);

    if (match) {
        const roles = Object.values(foundPlayer.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundPlayer.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { "username": foundPlayer.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // Saving refresh token with current user
        const otherPlayers = playersDB.players.filter(user => user.username !== foundPlayer.username);

        const currentPlayer = { ...foundPlayer, refreshToken };

        playersDB.setPlayers([...otherPlayers, currentPlayer]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "players.json"),
            JSON.stringify(playersDB.players)
        );
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", /*secure: true, */maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };