class VideosRepository {
	constructor(db, VideoError) {
		this.db = db;
		this.VideoError = VideoError;
	}

	readVideo = async (videoId) => {
		try {
			return await this.db.raw("CALL ReadVideo(?)", [videoId]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readChannelVideos = async (userId, sortBy, asc, offset, limit) => {
		try {
			return await this.db.raw("CALL ReadChannelVideos(?, ?, ?, ?, ?)", [
				userId,
				sortBy,
				asc,
				offset,
				limit,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readHomeVideos = async (videoCategory, offset, limit) => {
		try {
			return await this.db.raw("CALL ReadHomeVideos(?, ?, ?)", [
				videoCategory,
				offset,
				limit,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

  readPersonalizedHomeVideos = async (videoIds) => {
    try {
      return await this.db.raw("CALL ReadPersonalizedHomeVideos(?)", [
        videoIds
      ]);
    } catch (error) {
      throw this._handleDBError(error);
    }
  }

	readExploreVideos = async (offset, limit) => {
		try {
			return await this.db.raw("CALL ReadExploreVideos(?, ?)", [
				offset,
				limit
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	}

	readSubscriptionsVideos = async (userId, timeRange, offset, limit) => {
		try {
			return await this.db.raw(
				"CALL ReadSubscriptionsVideos(?, ?, ?, ?)",
				[userId, timeRange, offset, limit]
			);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readNextRecommendedVideo = async (videoId, videoCategory) => {
		try {
			return await this.db.raw("CALL ReadNextRecommendedVideo(?, ?)", [
				videoId,
				videoCategory,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readRecommendedVideos = async (videoId, videoCategory, offset, limit) => {
		try {
			return await this.db.raw("CALL ReadRecommendedVideos(?, ?, ?, ?)", [
				videoId,
				videoCategory,
				offset,
				limit,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	searchVideos = async (searchQuery, sortBy, asc, offset, limit) => {
		try {
			return await this.db.raw("CALL SearchVideos(?, ?, ?, ?, ?)", [
				searchQuery,
				sortBy,
				asc,
				offset,
				limit,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	incrementVideoTotalViews = async (videoId) => {
		try {
			return await this.db.raw("CALL IncrementVideoTotalViews(?)", [
				videoId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	updateVideo = async (
		videoId,
		videoTitle,
		videoDescription,
		videoCategory
	) => {
		try {
			return await this.db.raw("CALL UpdateVideo(?, ?, ?, ?)", [
				videoId,
				videoTitle,
				videoDescription,
				videoCategory,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	updateVideoCreatorData = async (userId, channelName, userProfilePicture) => {
		try {
			if (!userId) {
				throw this.VideoError.InvalidAttribute(userId, "userId", "userId is null.");
			}
			channelName = channelName ? channelName : null;
			userProfilePicture = userProfilePicture ? userProfilePicture : null;

			return await this.db.raw("CALL UpdateVideoCreatorData(?, ?, ?)", [
				userId,
				channelName,
				userProfilePicture
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	}

	incrementVideoCreatorSubscribersCount = async (userId) => {
		try {
			return await this.db.raw("CALL IncrementVideoCreatorSubscribersCount(?)", [
				userId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	}

	decrementVideoCreatorSubscribersCount = async (userId) => {
		try {
			return await this.db.raw("CALL DecrementVideoCreatorSubscribersCount(?)", [
				userId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	}
	

	deleteVideo = async (videoId) => {
		try {
			const deletedVideo = await this.db.raw("CALL ReadVideo(?)", [
				videoId,
			]);
			await this.db.raw("CALL DeleteVideo(?)", [videoId]);
			return deletedVideo;
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	uploadVideo = async ({
		videoId,
		videoFilePath,
		videoThumbnailPath,
		videoTitle,
		videoDescription,
		videoCategory,
		videoCreatedAt,
		videoTotalViews,
		videoDuration,
		userId,
		channelName,
		subscribersCount,
		userProfilePicture,
	}) => {
		try {
			return await this.db.raw(
				"CALL CreateVideo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[
					videoId,
					videoFilePath,
					videoThumbnailPath,
					videoTitle,
					videoDescription,
					videoCategory,
					videoCreatedAt,
					videoTotalViews,
					videoDuration,
					userId,
					channelName,
					subscribersCount,
					userProfilePicture,
				]
			);
		} catch (error) {
			console.error(error);
			throw this._handleDBError(error);
		}
	};

	updateVideoThumbnail = async (videoId, videoThumbnailPath) => {
		try {
			return await this.db.raw("CALL UpdateVideoThumbnail(?, ?)", [
				videoId,
				videoThumbnailPath,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	_handleDBError(error) {
		if (error.sqlMessage == null || error.errno == null) {
			return error;
		}

		if (error.sqlMessage === "Video not found") {
			return this.VideoError.VideoNotFound();
		}

		if (error.sqlMessage === "User not found") {
			return this.VideoError.UserNotFound();
		}

        if (error.sqlMessage === 'Invalid timeRange') {
            return this.VideoError.InvalidTimeRange();
        }

		if (error.errno === 1062) {
			const attributeName = getNameOfDupAttribute(error.sqlMessage);
			return this.VideoError.DuplicateAttributeValue(attributeName);

			function getNameOfDupAttribute(errorMessage) {
				const removedQuotes = errorMessage.split("'");
				return removedQuotes[removedQuotes.length - 2];
			}
		}

		return this.VideoError.UnhandledServerError(error);
	}
}

module.exports = VideosRepository;
