const Player = require("../model/Player");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { player, pwd } = req.body;

    if (!player || !pwd) return res.status(400).json({
        "message": "Username and password are required."
    });

    const foundPlayer = await Player.findOne({ username: player }).exec();

    if (!foundPlayer) return res.sendStatus(401); // Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundPlayer.password);

    if (match) {
        const roles = Object.values(foundPlayer.roles).filter(Boolean);
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
        foundPlayer.refreshToken = refreshToken;
        const result = await foundPlayer.save();

        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };