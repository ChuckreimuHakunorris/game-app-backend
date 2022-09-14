const express = require("express");
const router = express.Router();
const playersController = require("../../controllers/playersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/")
    .get(playersController.getAllPlayers)
    .put(verifyRoles(ROLES_LIST.Admin), playersController.updatePlayer)
    .delete(verifyRoles(ROLES_LIST.Admin), playersController.deletePlayer);

router.route("/:id")
    .get(playersController.getPlayer);

module.exports = router;