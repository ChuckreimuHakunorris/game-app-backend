const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/gameController");

router.post("/", gameController.handleGame);

module.exports = router;