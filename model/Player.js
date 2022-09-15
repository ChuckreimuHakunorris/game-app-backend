const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 1000
        },
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,
    created: { type: Date, default: Date.now },
    games_played: Number,
    wins: Number,
    losses: Number,
    draws: Number
});

module.exports = mongoose.model("Player", playerSchema);