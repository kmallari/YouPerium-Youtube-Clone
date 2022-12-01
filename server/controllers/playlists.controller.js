class PlaylistsController {
  constructor(
    playlistsRepository,
    playlistModel,
    videosInPlaylistModel,
    playlistErrors,
    playlistValidators,
    videosInPlaylistValidators
  ) {
    this.playlistsRepository = playlistsRepository;
    this.playlistModel = playlistModel;
    this.videosInPlaylistModel = videosInPlaylistModel;
    this.playlistErrors = playlistErrors;
    this.playlistValidators = playlistValidators;
    this.videosInPlaylistValidators = videosInPlaylistValidators;
  }

  createPlaylist = async (req, res, next) => {
    try {
      const {
        title,
        description,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl,
      } = req.body;

      this.playlistValidators.validatePlaylistCreationPayload({
        title,
        description,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl,
      });

      const playlist = new this.playlistModel(
        title,
        description,
        thumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl
      );

      const playlistBody = await playlist.getPlaylistDetails();

      await this.playlistsRepository.createPlaylist(
        playlistBody.id,
        playlistBody.title,
        playlistBody.description,
        playlistBody.thumbnailUrl,
        playlistBody.creatorId,
        playlistBody.creatorChannelName,
        playlistBody.creatorIconUrl,
        playlistBody.createdAt
      );

      return res.status(200).json({
        message: "Playlist created",
        data: playlistBody,
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  updatePlaylist = async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const { title, description, thumbnailUrl } = req.body;

      const updatedAt = Date.now();
      this.playlistValidators.validateUpdatePayload({
        title,
        description,
        thumbnailUrl,
      });

      const data = await this.playlistsRepository.updatePlaylist(
        playlistId,
        title,
        description,
        thumbnailUrl,
        updatedAt
      );

      if (!data[0][0][0]) {
        throw this.playlistErrors.PlaylistNotFoundError();
      }

      return res.status(200).json({
        message: "Playlist updated",
        data: {
          playlistId,
          title,
          description,
          thumbnailUrl,
          updatedAt,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  addVideoToPlaylist = async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const {
        videoId,
        videoTitle,
        videoChannelName,
        videoCreatedAt,
        videoDuration,
        videoThumbnailUrl,
        videoTotalViews,
      } = req.body;

      const videoInPlaylist = new this.videosInPlaylistModel(
        playlistId,
        videoId,
        videoTitle,
        videoChannelName,
        videoCreatedAt,
        videoDuration,
        videoThumbnailUrl,
        videoTotalViews
      );

      const videoInPlaylistBody =
        await videoInPlaylist.getVideoInPlaylistDetails();

      this.videosInPlaylistValidators.validateAddVideoToPlaylistPayload(
        videoInPlaylistBody
      );

      await this.playlistsRepository.addVideoToPlaylist(
        videoInPlaylistBody.id,
        videoInPlaylistBody.playlistId,
        videoInPlaylistBody.videoId,
        videoInPlaylistBody.videoTitle,
        videoInPlaylistBody.videoChannelName,
        videoInPlaylistBody.videoCreatedAt,
        videoInPlaylistBody.videoDuration,
        videoInPlaylistBody.videoThumbnailUrl,
        videoInPlaylistBody.videoTotalViews,
        videoInPlaylistBody.addedAt
      );

      return res.status(200).json({
        message: "Video added to playlist",
        data: videoInPlaylistBody,
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  removeVideoFromPlaylist = async (req, res, next) => {
    try {
      const { playlistId, videoId, videoIndex } = req.params;

      const checker = await this.playlistsRepository.checkIfVideoIndexIsValid(
        `${playlistId}-${videoId}`,
        videoIndex
      );

      if (!checker[0][0][0]) {
        throw this.playlistErrors.VideoHasIncorrectIndexError();
      }

      const data = await this.playlistsRepository.removeVideoFromPlaylist(
        `${playlistId}-${videoId}`,
        playlistId,
        videoIndex
      );

      // if the video is in the playlist, data[0][0][0] should not be undefined
      if (data[0][0][0]) {
        await this.playlistsRepository.decrementNumberOfVideosInPlaylist(
          playlistId
        );
        return res.status(200).json({
          message: "Video removed from playlist",
          data: {
            playlistId,
            videoId,
          },
        });
      } else {
        throw this.playlistErrors.VideoNotFoundError();
      }
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  getVideosFromPlaylist = async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      let { orderBy, page, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      this.videosInPlaylistValidators.validateGetVideosFromPlaylistPayload({
        playlistId,
        orderBy,
        page,
        limit,
      });

      let data;

      switch (orderBy) {
        case "addedAtDesc":
          data =
            await this.playlistsRepository.getVideosFromPlaylistByAddedAtDesc(
              playlistId,
              offset,
              limit
            );
          break;
        case "addedAtAsc":
          data =
            await this.playlistsRepository.getVideosFromPlaylistByAddedAtAsc(
              playlistId,
              offset,
              limit
            );
          break;
        case "createdAtDesc":
          data =
            await this.playlistsRepository.getVideosFromPlaylistByCreatedAtDesc(
              playlistId,
              offset,
              limit
            );
          break;
        case "createdAtAsc":
          data =
            await this.playlistsRepository.getVideosFromPlaylistByCreatedAtAsc(
              playlistId,
              offset,
              limit
            );
          break;
        case "popularity":
          data =
            await this.playlistsRepository.getVideosFromPlaylistByPopularity(
              playlistId,
              offset,
              limit
            );
          break;
        default:
          data = await this.playlistsRepository.getVideosFromPlaylistByIndex(
            playlistId,
            offset,
            limit
          );
          break;
      }

      return res.status(200).json({
        message: "Videos retrieved",
        data: data[0][0],
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  getPlaylistsOfUser = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const data = await this.playlistsRepository.getPlaylistsOfUser(userId);
      console.log({ data });
      return res.status(200).json({
        message: "Playlists retrieved",
        data: data[0][0],
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  deletePlaylist = async (req, res, next) => {
    try {
      const { playlistId } = req.params;

      await this.playlistsRepository.deletePlaylist(playlistId);

      return res.status(200).json({
        message: "Playlist deleted",
        data: {
          playlistId,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  changeVideoOrder = async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const { id, oldIndex, newIndex } = req.body;

      const maxIndexSQL =
        await this.playlistsRepository.getMaxIndexOfVideosInPlaylist(
          playlistId
        );

      const maxIndex = maxIndexSQL[0][0][0]["MAX(videoIndex)"];

      this.videosInPlaylistValidators.validateIndex(oldIndex, maxIndex);

      this.videosInPlaylistValidators.validateIndex(newIndex, maxIndex);

      if (newIndex > oldIndex) {
        await this.playlistsRepository.decrementVideoIndices(
          oldIndex,
          newIndex
        );
      } else if (newIndex < oldIndex) {
        await this.playlistsRepository.incrementVideoIndices(
          oldIndex,
          newIndex
        );
      }

      await this.playlistsRepository.updateVideoIndex(id, oldIndex, newIndex);

      return res.status(200).json({
        message: "Video order changed",
        data: {
          id,
          oldIndex,
          newIndex,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  getPlaylistsOfVideo = async (req, res, next) => {
    try {
      const { videoId } = req.params;

      const data = await this.playlistsRepository.getPlaylistsOfVideo(videoId);
      console.log({ data });
      return res.status(200).json({
        message: "Playlists with video retrieved",
        data: data[0][0],
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };

  getOnePlaylist = async (req, res, next) => {
    try {
      const { playlistId } = req.params;

      const data = await this.playlistsRepository.getOnePlaylist(playlistId);
      console.log({ data });
      return res.status(200).json({
        message: "Playlist retrieved",
        data: data[0][0],
      });
    } catch (error) {
      console.error(error);

      return res.status(error.code || 400).json({
        message: error.message,
        customCode: error.customCode,
      });
    }
  };
}

module.exports = PlaylistsController;
