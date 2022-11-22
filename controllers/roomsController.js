const Room = require("../model/Room");

const getAllRooms= async (req, res) => {
    const rooms = await Room.find();
    if (!rooms) return res.status(204).json({ "message": "No rooms found." });
    res.json(rooms);
}

const createNewRoom = async (req, res) => {
    if(!req?.body?.roomname || !req?.body?.hostname) {
        return res.status(400).json({ "message": "Room name and host name are required."});
    }

    try {
        const result = await Room.create({
            roomname: req.body.roomname,
            hostname: req.body.hostname,
            hostID: req.body.hostID,
            stage: req.body.stage
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateRoom = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ "message": "ID parameter is required." });
    }

    const room = await Room.findOne({ _id: req.body.id}).exec();

    if (!room) {
        return res.status(204).json({ "message": `No room matches ID ${req.body.id}.` });
    }

    if (req.body?.opponent_name) room.opponent_name = req.body.opponent_name;
    if (req.body?.opponentID) room.opponentID = req.body.opponentID;

    const result = await room.save();
    res.json(result);
}

const deleteRoom = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ "message": "Room ID required." });
    }

    const room = await Room.findOne({ _id: req.body.id}).exec();
    
    if (!room) {
        return res.status(204).json({ "message": `No room matches ID ${req.body.id}.` });
    }

    const result = await room.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getRoom = async (req, res) => {
    if(!req?.params?.id) {
        return res.status(400).json({ "message": "Room ID required." });
    }

    const room = await Room.findOne({ _id: req.params.id}).exec();

    if (!room) {
        return res.status(204).json({ "message": `No room matches ID ${req.params.id}.` });
    }

    res.json(room);
}

module.exports = {
    getAllRooms,
    createNewRoom,
    updateRoom,
    deleteRoom,
    getRoom
}