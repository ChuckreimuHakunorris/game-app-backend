const Player = require("../model/Player");

const handleLogout = async (req, res) => {
    // On client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in DB?
    const foundPlayer = await Player.findOne({ refreshToken }).exec();

    if (!foundPlayer) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204);
    }

    // Delete the refresh token in DB
    foundPlayer.refreshToken = "";
    const result = await foundPlayer.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };