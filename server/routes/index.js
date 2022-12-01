var express = require("express");
var router = express.Router();
const playlistsRouter = require("./playlists.route");

router.use("/p", playlistsRouter);

module.exports = router;
