const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomname: {
        type: String,
        required: true
    },
    hostname: {
        type: String,
        required: true
    },
    opponent_name: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", roomSchema);