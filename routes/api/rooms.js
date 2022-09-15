const express = require("express");
const router = express.Router();
const roomsController = require("../../controllers/roomsController");

router.route("/")
    .get(roomsController.getAllRooms)
    .post(roomsController.createNewRoom)
    .put(roomsController.updateRoom)
    .delete(roomsController.deleteRoom);

router.route("/:id")
    .get(roomsController.getRoom);

module.exports = router;