const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require("ffmpeg-static");
const stream = require("stream");
const { Duplex } = stream;
const fs = require("fs");
const { nanoid } = require("nanoid");

class VideoController {
	constructor(
		videoRepo,
		playlistRepo,
		VideoModel,
		VideoError,
		validators,
		awsPersonalize
	) {
		this.videoRepo = videoRepo;
		this.playlistRepo = playlistRepo;
		this.VideoModel = VideoModel;
		this.VideoError = VideoError;
		this.validators = validators;
		this.awsPersonalize = awsPersonalize;
	}

	readVideo = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);

			const videoId = req.params.videoId;
			this.validators.validateAttributes({ videoId }, true);

			let videoData = new this.VideoModel(
				(await this.videoRepo.readVideo(videoId))[0][0][0]
			);
			const videoResponse = videoData.getVideoResponse(
				`Successfully read video ${videoId}.`
			);

			return res.status(200).json(videoResponse);
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readChannelVideos = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"userId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"sortBy",
				"asc",
				"offset",
				"limit",
			]);

			const userId = req.params.userId;
			let { sortBy, asc, offset, limit } = req.query;
			asc = asc === "true" ? true : "false" ? false : null;

			this.validators.validateAttributes({ userId }, true);
			this.validators.validateNonAttributes(
				{
					sortBy,
					asc,
					offset,
					limit,
				},
				{ validSortByValues: ["videoCreatedAt", "videoTotalViews"] }
			);

			offset = +offset;
			limit = +limit;

			const channelVideos = (
				await this.videoRepo.readChannelVideos(
					userId,
					sortBy,
					asc,
					offset,
					limit
				)
			)[0][0];
			return res.status(200).json({
				message: `Successfully read videos of channel ${userId}`,
				data: channelVideos,
			});
		} catch (error) {
			console.log(error);
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readSubscriptionsVideos = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"userId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"timeRange",
				"offset",
				"limit",
			]);

			const { userId } = req.params;
			let { timeRange, offset, limit } = req.query;

			this.validators.validateAttributes({ userId }, true);
			this.validators.validateNonAttributes({
				timeRange,
				offset,
				limit,
			});

			offset = +offset;
			limit = +limit;

			const subscriptionVideos = (
				await this.videoRepo.readSubscriptionsVideos(
					userId,
					timeRange,
					offset,
					limit
				)
			)[0][0];
			return res.status(200).json({
				message: `Successfully read (${timeRange}) subscriptions videos of ${userId}`,
				data: subscriptionVideos,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readHomeVideos = async (req, res) => {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"videoCategory",
				"offset",
				"limit",
				"userId",
			]);

			let { videoCategory, offset, limit, userId } = req.query;

			this.validators.validateAttributes({ userId }, true);
			this.validators.validateAttributes({ videoCategory }, true);
			this.validators.validateNonAttributes({ offset, limit });

			offset = +offset;
			limit = +limit;

			let homeVideos;
			if (videoCategory === "all" && userId) {
				const personalizedVideos =
					await this.awsPersonalize.userPersonalization(userId);
				const videosIds = personalizedVideos.map(
					(video) => video.itemId
				);
				const videosIdsString = videosIds.join(",");
				const recommendedVideos =
					await this.videoRepo.readPersonalizedHomeVideos(
						videosIdsString
					);
				homeVideos = recommendedVideos[0][0];
			} else {
				homeVideos = (
					await this.videoRepo.readHomeVideos(
						videoCategory,
						offset,
						limit
					)
				)[0][0];
			}

			return res.status(200).json({
				message:
					videoCategory === "all"
						? `Successfully read the home videos.`
						: `Successfully read the ${videoCategory} videos.`,
				data: homeVideos,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readExploreVideos = async (req, res) => {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"offset",
				"limit",
			]);

			let { offset, limit } = req.query;
			this.validators.validateNonAttributes({ offset, limit });

			offset = +offset;
			limit = +limit;

			const exploreVideos = (
				await this.videoRepo.readExploreVideos(offset, limit)
			)[0][0];
			return res.status(200).json({
				message: "Successfully read the explore videos",
				data: exploreVideos,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};
	readExploreVideosNew = async (req, res) => {
		try {
			let useUserId = "";
			if (req.query.userId) {
				useUserId = req.query.userId;
			} else {
				useUserId = "guest" + nanoid(16);
			}
			const exploreVideo = await this.awsPersonalize.getPopularVideos(
				useUserId
			);
			const videosIds = exploreVideo.map((video) => video.itemId);
			const videosIdsString = videosIds.join(",");
			const recommendedVideos =
				await this.videoRepo.readPersonalizedHomeVideos(
					videosIdsString
				);
			const exploreVideos = recommendedVideos[0][0];
			return res.status(200).json({
				message: "Successfully read the explore videos",
				data: exploreVideos,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readNextRecommendedVideo = async (req, res) => {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"videoId",
				"videoCategory",
			]);

			const { videoId, videoCategory } = req.query;
			this.validators.validateAttributes(
				{ videoId, videoCategory },
				true
			);

			const simsVideos = await this.awsPersonalize.getSimsVideos(videoId);
			let nextRecommendedVideo;
			for (let i = 0; i < simsVideos.length; i++) {
				if (simsVideos[i].itemId !== "#NAME?") {
					nextRecommendedVideo = await this.videoRepo.readVideo(
						simsVideos[i].itemId
					);
					break;
				}
			}

			return res.status(200).json({
				message: "Successfully read the next recommended video.",
				data: nextRecommendedVideo[0][0][0],
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readRecommendedVideos = async (req, res) => {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"videoId",
				"videoCategory",
				"offset",
				"limit",
			]);

			let { videoId, videoCategory, offset, limit } = req.query;

			this.validators.validateAttributes(
				{ videoId, videoCategory },
				true
			);
			this.validators.validateNonAttributes({ offset, limit });

			offset = +offset;
			limit = +limit;

			const similarVideos = await this.awsPersonalize.getSimilarVideos(
				videoId
			);
			const videosIds = similarVideos.map((video) => video.itemId);
			const videosIdsString = videosIds.join(",");
			const recommendedVideos = (
				await this.videoRepo.readPersonalizedHomeVideos(videosIdsString)
			)[0][0];

			return res.status(200).json({
				message: "Successfully read the recommended videos.",
				data: recommendedVideos,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	searchVideos = async (req, res) => {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"searchQuery",
				"sortBy",
				"asc",
				"offset",
				"limit",
			]);

			let { searchQuery, sortBy, asc, offset, limit, userId } = req.query;
			asc = asc === "true" ? true : false;

			this.validators.validateNonAttributes(
				{
					searchQuery,
					sortBy,
					asc,
					offset,
					limit,
				},
				{
					validSortByValues: [
						"relevance",
						"videoCreatedAt",
						"videoTotalViews",
					],
				}
			);

			offset = +offset;
			limit = +limit;

			let searchedVideos = (
				await this.videoRepo.searchVideos(
					searchQuery,
					sortBy,
					asc,
					offset,
					limit
				)
			)[0][0];

			// Use AWS Personalize to re-arrange search result.
			if (userId && sortBy === "relevance") {
				if (!searchedVideos.length) {
					return res.status(200).json({
						message: `Successfully performed the personalized search query '${searchQuery}'`,
						data: searchedVideos,
					});
				}

				let originalVideoIds = searchedVideos.map(
					(videos) => videos.videoId
				);
				let personalizedVideoIds = (
					await this.awsPersonalize.getRanking(
						userId,
						originalVideoIds
					)
				).map((item) => item.itemId);

				let personalizedVideos = [];
				personalizedVideoIds.forEach((id) => {
					let indx = originalVideoIds.indexOf(id);
					personalizedVideos.push(searchedVideos[indx]);
				});

				return res.status(200).json({
					message: `Successfully performed the personalized search query '${searchQuery}'`,
					data: personalizedVideos,
				});
			} else {
				return res.status(200).json({
					message: `Successfully performed the search query '${searchQuery}'`,
					data: searchedVideos,
				});
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	updateVideo = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"videoTitle",
				"videoDescription",
				"videoCategory",
			]);

			const videoId = req.params.videoId;
			const attributes = { videoId, ...req.body };

			this.validators.validateAttributes(attributes, false);

			const { videoTitle, videoDescription, videoCategory } = req.body;
			let results = await this.videoRepo.readVideo(videoId);

			await this.awsPersonalize.postVideo({
				videoId: videoId,
				videoCategory: videoCategory,
				videoCreatedAt: results[0][0][0].videoCreatedAt,
			});
			const updatedVideo = (
				await this.videoRepo.updateVideo(
					videoId,
					videoTitle,
					videoDescription,
					videoCategory
				)
			)[0][0][0];

			await this.playlistRepo.updateVideoInPlaylists(
				videoId,
				updatedVideo.videoTitle,
				null,
				null
			);

			return res.status(200).json({
				message: `Successfully updated video ${videoId}.`,
				data: updatedVideo,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	incrementVideoTotalViews = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);

			const { videoId } = req.params;
			const { _eventType, _sentAt, _sessionId, _userId } = req.body;

			let event = {
				eventType: _eventType,
				itemId: videoId,
				sentAt: _sentAt,
				sessionId: _sessionId,
				userId: _userId,
			};

			this.validators.validateAttributes({ videoId }, false);

			const incrementedTotalViews = (
				await this.videoRepo.incrementVideoTotalViews(videoId)
			)[0][0][0];

			await this.playlistRepo.incrementPlaylistVideoTotalViews(videoId);

			const awsResponse = await this.awsPersonalize.putEvents(event);

			return res.status(200).json({
				message: `Successfully incremented total views of video ${videoId}.`,
				data: incrementedTotalViews,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	deleteVideo = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);

			const videoId = req.params.videoId;
			this.validators.validateAttributes({ videoId }, false);

			const deletedVideoResponse = new this.VideoModel(
				(await this.videoRepo.deleteVideo(videoId))[0][0][0]
			).getVideoResponse(`Successfully deleted video ${videoId}.`);

			await this.playlistRepo.decrementNumberOfVideosInPlaylist(videoId);

			return res.status(200).json(deletedVideoResponse);
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	uploadVideo = async (req, res) => {
		try {
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"userId",
				"channelName",
				"subscribersCount",
			]);

			const videoData = new this.VideoModel(req.body);

			ffmpeg.setFfprobePath(ffprobePath);
			function bufferToStream(buffer) {
				const duplexStream = new Duplex();
				duplexStream.push(buffer);
				duplexStream.push(null);
				return duplexStream;
			}
			let fileStream = bufferToStream(req.file.buffer);
			// @ts-ignore
			ffmpeg.ffprobe(fileStream, (error, metadata) => {
				// @ts-ignore
				videoData.videoDuration = Math.ceil(metadata.format.duration);
			});

			videoData.generateVideoThumbnailId();
			ffmpeg(fileStream)
				.toFormat("mp4")
				.setFfmpegPath(ffmpeg_static)
				.screenshots({
					count: 1,
					timemarks: [3],
					filename: videoData.thumbnailId,
					folder: __dirname + "/../temp",
				})
				.on("end", async () => {
					await videoData.uploadVideo(req.file);
					try {
						let image = await fs.promises.readFile(
							`${__dirname}/../temp/${videoData.videoThumbnailId}.jpg`
						);
						await videoData.uploadVideoThumbnail(image);
						await this.videoRepo.uploadVideo(videoData);
						await this.awsPersonalize.postVideo(videoData);
						res.status(201).json({
							message: "Video uploaded with thumbnail",
							data: videoData,
						});
					} catch (err) {
						videoData.videoThumbnailId = "";
						await this.videoRepo.uploadVideo(videoData);
						await this.awsPersonalize.postVideo(videoData);
						res.status(201).json({
							message: "Video uploaded with no thumbnail",
							data: videoData,
						});
					}
				})
				.on("error", function (err, stdout, stderr) {
					res.status(400).json({ error: "Video upload failed" });
				});
		} catch (error) {
			/* NO ERROR CODES FOR NOW */
			res.status(400).json(error);
		}
	};

	updateVideoThumbnail = async (req, res) => {
		try {
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"videoId",
			]);

			const videoData = new this.VideoModel(req.body);
			videoData.generateVideoThumbnailId();
			console.log("Video data is", videoData);

			console.log("UPLOADING VIDEO TO S3");
			await videoData.uploadVideoThumbnail(req.file);
			console.log("UPLOADED VIDEO TO S3");
			await this.videoRepo.updateVideoThumbnail(
				req.body.videoId,
				videoData.videoThumbnailPath
			);

			await this.playlistRepo.updateVideoInPlaylists(
				req.body.videoId,
				null,
				null,
				videoData.videoThumbnailPath
			);

			res.status(201).json({
				thumbnail: videoData.videoThumbnailPath,
			});
		} catch (error) {
			/* NO ERROR CODES FOR NOW */
			res.status(400).json(error);
		}
	};
}

module.exports = VideoController;
