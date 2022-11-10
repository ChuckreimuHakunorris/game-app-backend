const Player = require("../model/Player");

const getAllPlayers = async (req, res) => {
    const players = await Player.find();

    if (!players) return res.status(204).json({ "message": "No players found." });

    let playerDataContainers = [];

    for (let i = 0; i < players.length; i++) {
        const playerData = {
            username: players[i].username,
            games_played: players[i].games_played,
            wins: players[i].wins,
            draws: players[i].draws,
            losses: players[i].losses
        }

        playerDataContainers.push(playerData);
    }

    res.json(playerDataContainers);
}

const updatePlayer = async (req, res) => {
    if (!req?.body?.username) {
        return res.status(400).json({ "message": "Username is required." });
    }

    const player = await Player.findOne({ username: req.body.username }).exec();

    if (!player) {
        return res.status(204).json({ "message": `No player matches username ${req.body.username}.` });
    }

    if (req.body?.games_played) player.games_played = req.body.games_played;
    if (req.body?.wins) player.wins = req.body.wins;
    if (req.body?.losses) player.losses = req.body.losses;
    if (req.body?.draws) player.draws = req.body.draws;

    const result = await player.save();
    res.json(result);
}

const deletePlayer = (req, res) => {
    res.json({
        "name": req.body.name
    })
}

const getPlayer = async (req, res) => {
    if(!req?.params?.username) {
        return res.status(400).json({ "message": "Username is required." });
    }

    const player = await Player.findOne({ username: req.params.username}).exec();

    if (!player) {
        return res.status(204).json({ "message": `No player matches username ${req.params.id}.` });
    }

    const playerData = {
        username: player.username,
        games_played: player.games_played,
        wins: player.wins,
        draws: player.draws,
        losses: player.losses
    }

    res.json(playerData);
}

module.exports = {
    getAllPlayers,
    updatePlayer,
    deletePlayer,
    getPlayer
}