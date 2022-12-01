/*
    User API:

    Method: GET
    * searchChannels
        - route:
            - GET /u/search?searchQuery=*&sortBy=*&asc=*&offset=*&limit=*
        - query params:
            - searchQuery (string)
            - sortBy ('createdAt' | 'subscribersCount')
            - asc (boolean)
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            - array of channels matching the search query
        - example:
            - GET /u/search?searchQuery=cats&sortBy=createdAt&asc=true&offset=0&limit=10
*/

var express = require("express");
var router = express.Router();
const passport = require("../middlewares/passport");

const db = require("../config/db.config");
const UsersRepository = require("../repositories/users.repository");
const UsersController = require("../controllers/users.controller");
const User = require("../models/users.model");
const UsersErrors = require("../error/users.error");
const UsersValidators = require("../validators/users.validators");
const authenticateRoute = require("../middlewares/passport");
const awsPersonalizeHelpers = require("../helpers/awsPersonalizeHelpers");

const VideosRespository = require("../repositories/videos.repository");
const VideosErrors = require("../error/videos.error");

const PlaylistsRepository = require("../repositories/playlists.repository");
const PlaylistsErrors = require("../error/playlists.error");

const CommentsRepository = require("../repositories/comments.repository");
const CommentsErrors = require("../error/comments.error");

const { upload } = require("../utils/storage");



const usersController = new UsersController(
	new UsersRepository(db, UsersErrors),
	new VideosRespository(db, VideosErrors),
	new PlaylistsRepository(db, PlaylistsErrors),
	new CommentsRepository(db, CommentsErrors),
	User,
	UsersErrors,
	new UsersValidators(UsersErrors),
	awsPersonalizeHelpers
);

router.post("/login", usersController.loginUser.bind(usersController));
router.post(
	"/confirm",
	authenticateRoute,
	usersController.confirmIdentity.bind(usersController)
);
router.post(
	"/changePassword",
	authenticateRoute,
	usersController.changePassword.bind(usersController)
);

router.post("/check", usersController.checkUser.bind(usersController));

router.get("/search", usersController.searchChannels.bind(usersController));
router.get(
	"/subscriptions",
	authenticateRoute,
	usersController.getSubscriptions.bind(usersController)
);
router.get(
	"/subscribed/:subscribeeId",
	authenticateRoute,
	usersController.getSubscriptionById.bind(usersController)
);
router.post(
	"/:subscribeeChannelName/subscribe",
	authenticateRoute,
	usersController.subscribeToChannel.bind(usersController)
);
router.post(
	"/:subscribeeChannelName/unsubscribe",
	authenticateRoute,
	usersController.unsubscribeFromChannel.bind(usersController)
);

router.post("/", usersController.createUser.bind(usersController));
router.patch(
	"/",
	authenticateRoute,
	usersController.patchUser.bind(usersController)
);

router.get(
	"/:channelName",
	usersController.getUserByChannelName.bind(usersController)
);

router.post(
	"/uploadProfilePicture/:userId",
	upload.single("profilePicture"),
	authenticateRoute,
	usersController.uploadProfilePicture.bind(usersController)
);
router.post(
	"/uploadChannelBanner/:userId",
	upload.single("channelBanner"),
	authenticateRoute,
	usersController.uploadChannelBanner.bind(usersController)
);
router.get(
	"/id/:userId",
	authenticateRoute,
	usersController.getUserByUserId.bind(usersController)
);

module.exports = router;
