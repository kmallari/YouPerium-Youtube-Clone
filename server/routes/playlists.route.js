/*

PLAYLISTS API

METHOD: POST
  * Creating a Playlist
    - usage:
      - POST /p/create
    - body:
        title,
        description,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl
        
    - return:
        id,
        title,
        description,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl,
        createdAt

  * Adding a Video to a Playlist
    - usage:
      - POST /p/add/:playlistId
    - body:
        videoId,
        videoTitle,
        videoChannelName,
        videoCreatedAt,
        videoDuration,
        videoThumbnailUrl,
        videoTotalViews
    - return:
        id,
        playlistId,
        videoId,
        videoTitle,
        videoChannelName,
        videoCreatedAt,
        videoDuration,
        videoThumbnailUrl,
        videoTotalViews,
        addedAt

METHOD: GET
  * Getting a user's playlists
    - usage:
      - GET /p/u/:userId
    - return:
        id,
        title,
        description,
        numberOfVideos,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl,
        createdAt,
        updatedAt

  * Getting a playlist's videos
    - usage:
      - GET /p/:playlistId?orderBy=popularity&page=1&limit=10
    - quereies:
        orderBy:
          - popularity
          - createdAtDesc
          - createdAtAsc
          - AddedAtDesc
          - AddedAtAsc
        page:
          - number
          - this is the page number
        limit:
          - number
          - this is the number of elements per page
    - return:
        id,
        playlistId,
        videoId,
        videoTitle,
        videoChannelName,
        videoCreatedAt,
        videoDuration,
        videoThumbnailUrl,
        videoTotalViews,
        addedAt

METHOD: PATCH
  * Updating a playlists's details (title, description, thumbnailUrl)
    - usage:
      - PATCH /p/update/:playlistId
    - body (each field is optional):
        title,
        description,
        thumbnailUrl,
    - return:
        playlistId,
        title,
        description,
        thumbnailUrl,
        updatedAt
  * Updating the order of the videos in a playlist
    - usage:
      - PATCH /p/reorder/:playlistId
    - body:
      - id: <playlistId>-<videoId> format
      - oldIndex: the old index of the video in the playlist
      - newIndex: the new index of the video in the playlist

METHOD: DELETE
  * Deleting a playlist
    - usage:
      - DELETE /p/:playlistId
    - return:
        playlistId

  * Deleting a video from a playlist
    - usage:
      - DELETE /p/remove/:playlistId/:videoId/:index
    - return:
        playlistId,
        videoId

*/

var express = require("express");
var router = express.Router();
const authenticateRoute = require("../middlewares/passport");
const db = require("../config/db.config");
const Repository = require("../repositories/playlists.repository");
const Controller = require("../controllers/playlists.controller");
const { Playlist, VideosInPlaylist } = require("../models/playlists.model");
const PlaylistErrors = require("../error/playlists.error");
const {
  PlaylistsValidators,
  VideosInPlaylistValidators,
} = require("../validators/playlists.validators");

const playlistsRepository = new Repository(db, PlaylistErrors);
const playlistsController = new Controller(
  playlistsRepository,
  Playlist,
  VideosInPlaylist,
  PlaylistErrors,
  new PlaylistsValidators(PlaylistErrors),
  new VideosInPlaylistValidators(PlaylistErrors)
);

router.post(
  "/create",
  authenticateRoute,
  playlistsController.createPlaylist
);
router.patch(
  "/update/:playlistId",
  authenticateRoute,
  playlistsController.updatePlaylist
);
router.post(
  "/add/:playlistId",
  authenticateRoute,
  playlistsController.addVideoToPlaylist
);
router.delete(
  "/remove/:playlistId/:videoId/:videoIndex",
  authenticateRoute,
  playlistsController.removeVideoFromPlaylist
);
router.get("/u/:userId", playlistsController.getPlaylistsOfUser);
router.get("/:playlistId", playlistsController.getVideosFromPlaylist);
router.get("/data/:playlistId", playlistsController.getOnePlaylist);
router.get("/v/:videoId", playlistsController.getPlaylistsOfVideo);
router.delete("/:playlistId", playlistsController.deletePlaylist);
router.patch("/reorder/:playlistId", playlistsController.changeVideoOrder);

module.exports = router;
