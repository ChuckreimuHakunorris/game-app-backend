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
    games_played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 }
});

module.exports = mongoose.model("Player", playerSchema);