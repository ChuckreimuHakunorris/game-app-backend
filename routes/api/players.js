const express = require("express");
const router = express.Router();
const data = {};
data.players = require("../../data/players.json");

router.route("/")
    .get((req, res) => {
        res.json(data.players);
    })
    .post((req, res) => {
        res.json({
            "name": req.body.name
        })
    })
    .put((req, res) => {
        res.json({
            "name": req.body.name
        })
    })
    .delete((req, res) => {
        res.json({
            "name": req.body.id
        })
    });

router.route("/:id")
    .get((req, res) => {
        res.json({ "id": req.params.id });
    })

module.exports = router;