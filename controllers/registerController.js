const Player = require("../model/Player");
const bcrypt = require("bcrypt");

const handleNewPlayer = async (req, res) => {
    const { player, pwd } = req.body;
    if (!player || !pwd) return res.status(400).json({
        "message": "Username and password are required."
    });

    // Check for duplicate usernames in the db
    const duplicate = await Player.findOne({ username: player }).exec();

    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Create and store the new player
        const result = await Player.create({
             "username": player,
             "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ "success": `New player ${player} created!` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { handleNewPlayer };