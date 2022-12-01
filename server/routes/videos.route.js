/* 
    Video API:

    Method: GET
    * readVideo
        - route:
            - GET /videos/:videoId
        - params: 
            - videoId (string)
        - returns: 
            - data about the video
            - videoFile: url to video
            - thumbnail: url to thumbnail (if exists)
        - example:
            - GET /videos/AAAAAAAAAAAAAAAAAAAAA

    * readHomeVideos
        - route:
            - GET /videos/home?videoCategory=*&offset=*&limit=*
        - query params: 
            - videoCategory (string. if equal to 'all', no specific videoCategory)
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            home videos
        - example:
            - GET /videos/home?videoCategory=all&offset=0&limit=10
        
    * readExploreVideos
        - route:
            - GET /videos/explore?offset=*&limit=*
        - query params:
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            - explore videos
        - example:
            - GET /videos/explore?offset=0&limit=10

    * readNextRecommendedVideo
        - route:
            - GET /videos/nextRecommendedVideo?videoId=*&videoCategory=*
        - query params: 
            - videoId (string)
            - videoCategory (string)
        - returns:
            - next recommended video
        - example:
            - GET /videos/nextRecommendedVideo?videoId=AAAAAAAAAAAAAAAAAAAAA&videoCategory=Gaming

    * readRecommendedVideos
        - route:
            - GET /videos/recommendedVideos?videoId=*&videoCategory=*&offset=*&limit=*
        - query params: 
            - videoId (string)
            - videoCategory (string)
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            - recommended videos
        - example:
            - GET /videos/recommendedVideos?videoId=AAAAAAAAAAAAAAAAAAAAA&videoCategory=Gaming&offset=0&limit=10

    * readChannelVideos
        - route:
            - GET /videos/user/:userId/videos?sortBy=*&asc=*&offset=*&limit=*
        - params:
            - userId (string)
        - query params:
            - sortBy ('videoTotalViews' | 'videoCreatedAt')
            - asc (boolean)
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            channel videos
        - example:
            - GET /videos/user/UUUUUUUUUUUUUUUUUUUU1?sortBy=videoCreatedAt&asc=false&offset=0&limit=10

    * readSubscriptionsVideos
        - route:
            - GET /videos/user/:userId/subscriptions?timeRange=*&offset=*&limit=*
        - params:
            - userId (string)
        - query params:
            - timeRange ('today' | 'thisWeek' | 'thisMonth' | 'older')
            - offset (int >= 0)
            - limit (int >= 1)
        - returns:
            - subscriptions videos
        - example:
            - GET /videos/user/UUUUUUUUUUUUUUUUUUUU1/subscriptions?timeRange=older&offset=0&limit=10
        - note:
            - videos fetched with 'thisWeek' contain the videos fetched with 'today'
              and so on.

    * searchVideos
        - route:
            - GET /videos/search?searchQuery=*&sortBy=*&asc=*&offset=*&limit=*
        - query params:
            - searchQuery (string)
            - sortBy ('relevance' | 'videoCreatedAt' | 'videoTotalViews')
            - asc (boolean)
            - offset (int >= 0)
            - limit (int >= 1)
            - userId (string, optional only if logged-in)
        - returns:
            - array of videos matching the search query
        - example:
            - GET /videos/search?searchQuery=cats&sortBy=videoCreatedAt&asc=true&offset=0&limit=10

    Method: POST
    * uploadVideo
        - example:
            - POST /videos
        - header:
            - Content-Type: multipart/form-data
        - body params:
            - userId (string)
            - channelName (string)
            - subscribersCount (int)
            - videoFile (file)
        - return
            - data about the created video
            - videoFile: url to video
            - thumbnail: url to thumbnail (if generated)

    * updateVideoThumbnail
        - example: 
            - POST /videos/thumbnail
        - header:
            - Content-Type: multipart/form-data
        - body params:
            - videoId (string)
            - thumbnail (file)
        - return
            - thumbnail: url to thumbnail

    Method: PATCH
    * incrementVideoTotalViews
        - route:
            - PATCH /videos/:videoId/videoTotalViews
        - params:
            - videoId (string)
        - returns:
            - the incremented videoTotalViews.
        - example:
            - PATCH /videos/VVVVVVVVVVVVVVVVVVV82/videoTotalViews
    
    * updateVideo
        0 route:
            - PATCH /videos/:videoId
              Request Body:
                {
                    "videoTitle": *,
                    "videoDescription": *,
                    "videoCategory": *
                }
        - params:
            - videoId (string)
        - request body fields:
            - videoTitle (string)
            - videoDescription (string)
            - videoCategory (string)
        - returns:
            - an object with the updated videoTitle, videoDescription, videoCategory
              as its fields.
        - example:
            - PATCH /videos/VVVVVVVVVVVVVVVVVVV82
              Request Body:
                {
                    "videoTitle": "Billie Jeans",
                    "videoDescription": "By Michael Jackson",
                    "videoCategory": "Music"
                }

    Method: DELETE
    * deleteVideo
        - route:
            - DELETE /videos/:videoId
        - params:
            - videoId (string)
        - returns:
            - the deleted video.
        - example:
            - DELETE /videos/VVVVVVVVVVVVVVVVVVV82
*/

var express = require("express");
var router = express.Router();

const db = require("../config/db.config");
const VideosRepository = require("../repositories/videos.repository");
const PlaylistRepository = require("../repositories/playlists.repository");
const VideoController = require("../controllers/videos.controller");
const VideoModel = require("../models/videos.model");
const VideoErrors = require("../error/videos.error");
const PlaylistErrors = require("../error/playlists.error");
const VideoConstants = require('../config/constants/videos.constants');
const VideoValidators = require("../validators/videos.validators");

const { upload } = require("../utils/storage");

const awsPersonalize = require("../helpers/awsPersonalizeHelpers.js")

const videosRepository = new VideosRepository(db, VideoErrors);
const playlistsRepository = new PlaylistRepository(db, PlaylistErrors);
const videoController = new VideoController(
	videosRepository,
    playlistsRepository,
	VideoModel,
	VideoErrors,
	new VideoValidators(VideoErrors, VideoConstants),
    awsPersonalize
);


router.post("/", upload.single("videoFile"), videoController.uploadVideo);
router.post('/thumbnail', upload.single("thumbnail"), videoController.updateVideoThumbnail);

router.get("/user/:userId/subscriptions", videoController.readSubscriptionsVideos);
router.get("/user/:userId/videos", videoController.readChannelVideos);
router.get("/home", videoController.readHomeVideos);
router.get("/explore", videoController.readExploreVideosNew);
router.get("/exploreNew", videoController.readExploreVideosNew);
router.get("/nextRecommendedVideo", videoController.readNextRecommendedVideo);
router.get("/recommendedVideos", videoController.readRecommendedVideos);
router.get("/search", videoController.searchVideos);
router.get("/:videoId", videoController.readVideo);

router.patch("/:videoId/videoTotalViews", videoController.incrementVideoTotalViews);
router.patch("/:videoId", videoController.updateVideo);

router.delete("/:videoId", videoController.deleteVideo);

module.exports = router;
