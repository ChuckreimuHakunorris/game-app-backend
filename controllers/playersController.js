const data = {};
data.players = require("../model/players.json");

const getAllPlayers = (req, res) => {
    res.json(data.players);
}

const createNewPlayer = (req, res) => {
    res.json({
        "name": req.body.name
    })
}

const updatePlayer = (req, res) => {
    res.json({
        "name": req.body.name
    })
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
    createNewPlayer,
    updatePlayer,
    deletePlayer,
    getPlayer
}