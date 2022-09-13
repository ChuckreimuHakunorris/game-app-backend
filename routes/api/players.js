const express = require("express");
const router = express.Router();
const playersController = require("../../controllers/playersController");

router.route("/")
    .get(playersController.getAllPlayers)
    .post(playersController.createNewPlayer)
    .put(playersController.updatePlayer)
    .delete(playersController.deletePlayer);

router.route("/:id")
    .get(playersController.getPlayer)

module.exports = router;