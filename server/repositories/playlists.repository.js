const {
  ItemFilterSensitiveLog,
} = require("@aws-sdk/client-personalize-events");

class PlaylistsRepository {
  constructor(db, errors) {
    this.db = db;
    this.errors = errors;
  }

  _SQLErrorHandler(error, userData) {
		if (error.code === "ER_DUP_ENTRY") {
			// parse error.sqlMessage using regex to get the duplicate key
			const duplicateKey = /key '(\w+)'/.exec(error.sqlMessage)[1];

			throw this.errors.DuplicateAttributeValue(`${duplicateKey}`);
		}
		throw error;
	}

  createPlaylist = async (
    playlistId,
    playlistTitle,
    description,
    playlistThumbnailUrl,
    creatorId,
    creatorChannelName,
    creatorIconUrl,
    createdAt
  ) => {
    try {
      return await this.db.raw("CALL CreatePlaylist(?, ?, ?, ?, ?, ?, ?, ?)", [
        playlistId,
        playlistTitle,
        description,
        playlistThumbnailUrl,
        creatorId,
        creatorChannelName,
        creatorIconUrl,
        createdAt,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  updatePlaylist = async (
    playlistId,
    playlistTitle,
    description,
    playlistThumbnailUrl,
    updatedAt
  ) => {
    try {
      return await this.db.raw("CALL UpdatePlaylist(?, ?, ?, ?, ?)", [
        playlistId,
        playlistTitle || null,
        description || null,
        playlistThumbnailUrl || null,
        updatedAt,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getCountOfVideosInPlaylist = async (playlistId) => {
    try {
      return await this.db.raw("CALL GetCountOFVideosInPlaylist(?)", [
        playlistId,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getMaxIndexOfVideosInPlaylist = async (playlistId) => {
    try {
      return await this.db.raw("CALL GetMaxIndexOfVideosInPlaylist(?)", [
        playlistId,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  addVideoToPlaylist = async (
    id,
    playlistId,
    videoId,
    videoTitle,
    videoChannelName,
    videoCreatedAt,
    videoDuration,
    videoThumbnailFileLink,
    videoTotalViews,
    addedAt
  ) => {
    try {
      return await this.db.raw(
        "CALL AddVideoToPlaylist(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          playlistId,
          videoId,
          videoTitle,
          videoChannelName,
          videoCreatedAt,
          videoDuration,
          videoThumbnailFileLink,
          videoTotalViews,
          addedAt,
        ]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  removeVideoFromPlaylist = async (id, playlistId, index) => {
    try {
      return await this.db.raw("CALL RemoveVideoFromPlaylist(?, ?, ?)", [
        id,
        playlistId,
        index,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  checkIfVideoIndexIsValid = async (id, index) => {
    try {
      return await this.db.raw("CALL CheckIfVideoIndexIsValid(?, ?)", [
        id,
        index,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylist = async (playlistId) => {
    try {
      return await this.db.raw("CALL GetVideosFromPlaylist(?)", [playlistId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByAddedAtDesc = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw(
        "CALL GetVideosFromPlaylistByAddedAtDesc(?, ?, ?)",
        [playlistId, offset, limit]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByAddedAtAsc = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw(
        "CALL GetVideosFromPlaylistByAddedAtAsc(?, ?, ?)",
        [playlistId, offset, limit]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByCreatedAtDesc = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw(
        "CALL GetVideosFromPlaylistByCreatedAtDesc(?, ?, ?)",
        [playlistId, offset, limit]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByCreatedAtAsc = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw(
        "CALL GetVideosFromPlaylistByCreatedAtAsc(?, ?, ?)",
        [playlistId, offset, limit]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByPopularity = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw(
        "CALL GetVideosFromPlaylistByPopularity(?, ?, ?)",
        [playlistId, offset, limit]
      );
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getVideosFromPlaylistByIndex = async (playlistId, offset, limit) => {
    try {
      return await this.db.raw("CALL GetVideosFromPlaylistByIndex(?, ?, ?)", [
        playlistId,
        offset,
        limit,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getPlaylistsOfUser = async (userId) => {
    try {
      return await this.db.raw("CALL GetPlaylistsOfUser(?)", [userId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  deletePlaylist = async (playlistId) => {
    try {
      return await this.db.raw("CALL DeletePlaylist(?)", [playlistId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  updateVideoIndex = async (id, oldIndex, newIndex) => {
    try {
      return await this.db.raw("CALL UpdateVideoIndex(?, ?, ?)", [
        id,
        oldIndex,
        newIndex,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  incrementVideoIndices = async (startIndex, endIndex) => {
    try {
      return await this.db.raw("CALL IncrementVideoIndices(?, ?)", [
        startIndex,
        endIndex,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  decrementVideoIndices = async (startIndex, endIndex) => {
    try {
      return await this.db.raw("CALL DecrementVideoIndices(?, ?)", [
        startIndex,
        endIndex,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getPlaylistsOfVideo = async (videoId) => {
    try {
      return await this.db.raw("CALL GetPlaylistsOfVideo(?)", [videoId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  getOnePlaylist = async (playlistId) => {
    try {
      return await this.db.raw("CALL GetOnePlaylist(?)", [playlistId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  updateVideoInPlaylists = async (
    videoId,
    title,
    videoChannel,
    thumbnailurl
  ) => {
    try {
      return await this.db.raw("CALL UpdateVideoInPlaylists(?, ?, ?, ?)", [
        videoId,
        title || null,
        videoChannel || null,
        thumbnailurl || null,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  incrementPlaylistVideoTotalViews = async (videoId) => {
    try {
      return await this.db.raw("CALL IncrementPlaylistVideoTotalViews(?)", [videoId]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  decrementNumberOfVideosInPlaylist = async (videoId) => {
    try {
      return await this.db.raw("CALL DecrementNumberOfVideosInPlaylist(?)", [
        videoId,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  };

  updatePlaylistCreatorData = async (creatorId, channelName, userProfilePicture) => {
    try {
      return await this.db.raw("CALL UpdatePlaylistCreatorData(?, ?, ?)", [
        creatorId,
        channelName || null,
        userProfilePicture || null,
      ]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  }

  updateVideoInPlaylistChannelName = async (channelName, oldChannelName) => {
    try {
      return await this.db.raw("CALL UpdateVideoInPlaylistChannelName(?, ?)", [channelName, oldChannelName]);
    } catch (error) {
      throw this._SQLErrorHandler(error);
    }
  }
}

module.exports = PlaylistsRepository;
