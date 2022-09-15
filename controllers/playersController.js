const Player = require("../model/Player");

const getAllPlayers = async (req, res) => {
    const players = await Player.find();
    if (!players) return res.status(204).json({ "message": "No players found." });
    res.json(players);
}

const updatePlayer = async (req, res) => {

}

const deletePlayer = (req, res) => {
    res.json({
        "name": req.body.name
    })
}

const getPlayer = (req, res) => {
    res.json({ "id": req.params.id });
}

module.exports = {
    getAllPlayers,
    updatePlayer,
    deletePlayer,
    getPlayer
}