const playersDB = {
    players: require("../model/players.json"),
    setPlayers: function (data) { this.players = data }
}

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    console.log(cookies.jwt);

    const refreshToken = cookies.jwt;

    const foundPlayer = playersDB.players.find(user => user.refreshToken === refreshToken);

    if (!foundPlayer) return res.sendStatus(403); // Forbidden

    // Evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundPlayer.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundPlayer.roles);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ accessToken });
        }
    )
}

module.exports = { handleRefreshToken };