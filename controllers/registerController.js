const playersDB = {
    players: require("../model/players.json"),
    setPlayers: function (data) { this.players = data}
}

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewPlayer = async (req, res) => {
    const { player, pwd } = req.body;
    if (!player || !pwd) return res.status(400).json({
        "message": "Username and password are required."
    });

    // Check for duplicate usernames in the db
    const duplicate = playersDB.players.find(user => user.username === player);

    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        
        const date = new Date();
        
        // Store the new player
        const newPlayer = {
             "username": player,
             "roles" : { "User": 1000 },
             "password": hashedPwd,
             "created_on": date,
             "games_played": 0,
             "wins": 0,
             "losses": 0,
             "draws": 0
            };
        playersDB.setPlayers([...playersDB.players, newPlayer]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "players.json"),
            JSON.stringify(playersDB.players)
        );
        console.log(playersDB.players);
        res.status(201).json({ "success": `New player ${player} created!` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { handleNewPlayer };