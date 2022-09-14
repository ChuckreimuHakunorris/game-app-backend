const playersDB = {
    players: require("../model/players.json"),
    setPlayers: function (data) { this.players = data }
}
const bcrypt = require("bcrypt");

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
        // create JWTs
        res.json({ "success": `Player ${player} is logged in!` })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };