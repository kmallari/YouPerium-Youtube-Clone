const Validators = require("./validator");

const rgxId = new RegExp(/^[A-Za-z0-9_-]{21}$/);

class PlaylistsValidators extends Validators {
  constructor(errors) {
    super(errors);
  }


  validateTitle = (title) => {
    if (title === undefined) {
      return true;
    }
    if (title.length < 1 || title.length > 50) {
      throw this.errors.TitleError();
    }
    return true;
  };

  validateDescription = (description) => {
    if (description === undefined) {
      return true;
    }
    if (description.length < 0 || description.length > 5000) {
      throw this.errors.DescriptionError();
    }
    return true;
  };

  validateCreatorId = (creatorId) => {
    if (!creatorId) {
      throw this.errors.MissingRequestBodyField("creatorId");
    } else if (!rgxId.test(creatorId)) {
      throw this.errors.InvalidAttribute(
        creatorId,
        "creatorId",
        "Failed to match regex pattern."
      );
    }
    return true;
  };

  validateCreatorChannelName = (creatorChannelName) => {
    if (!creatorChannelName) {
      throw this.errors.MissingRequestBodyField("creatorChannelName");
    }
    return true;
  };

  validateCreatorIconUrl = (creatorIconUrl) => {
    if (!creatorIconUrl) {
      throw this.errors.MissingRequestBodyField("creatorIconUrl");
    }
    return true;
  };

  validateThumbnailUrl = (thumbnailUrl) => {
    return true;
  };

  validatePlaylistCreationPayload = (payload) => {
    try {
      return (
        this.validateTitle(payload.title) &&
        this.validateDescription(payload.description) &&
        this.validateCreatorId(payload.creatorId) &&
        this.validateCreatorChannelName(payload.creatorChannelName) &&
        this.validateCreatorIconUrl(payload.creatorIconUrl)
      );
    } catch (err) {
      throw err;
    }
  };

  validateUpdatePayload = (payload) => {
    try {
      return (
        this.validateTitle(payload.title) ||
        this.validateDescription(payload.description) ||
        this.validateThumbnailUrl(payload.thumbnailUrl)
      );
    } catch (err) {
      throw err;
    }
  };
}

class VideosInPlaylistValidators extends Validators {
  constructor(errors) {
    super(errors);
  }

  validateVideoId = (videoId) => {
    if (!videoId) {
      throw this.errors.MissingRequestBodyField("videoId");
    } else if (!rgxId.test(videoId)) {
      throw this.errors.InvalidAttribute(
        videoId,
        "videoId",
        "Failed to match regex pattern."
      );
    }
    return true;
  };

  validatePlaylistId = (playlistId) => {
    if (!playlistId) {
      throw this.errors.MissingRequestBodyField("playlistId");
    } else if (!rgxId.test(playlistId)) {
      throw this.errors.InvalidAttribute(
        playlistId,
        "playlistId",
        "Failed to match regex pattern."
      );
    }
    return true;
  };

  validateVideoTitle = (videoTitle) => {
    if (!videoTitle) {
      throw this.errors.MissingRequestBodyField("videoTitle");
    }
    return true;
  };

  validateVideoChannelName = (videoChannelName) => {
    if (!videoChannelName) {
      throw this.errors.MissingRequestBodyField("videoChannelName");
    }
    return true;
  };

  validateVideoCreatedAt = (videoCreatedAt) => {
    if (!videoCreatedAt) {
      throw this.errors.MissingRequestBodyField("videoCreatedAt");
    }
    return true;
  };

  validateVideoDuration = (videoDuration) => {
    if (!videoDuration) {
      throw this.errors.MissingRequestBodyField("videoDuration");
    }
    return true;
  };

  validateVideoThumbnailUrl = (videoThumbnailUrl) => {
    if (!videoThumbnailUrl) {
      throw this.errors.MissingRequestBodyField("videoThumbnailUrl");
    }
    return true;
  };

  validateVideoTotalViews = (videoTotalViews) => {
    if (videoTotalViews === undefined) {
      throw this.errors.MissingRequestBodyField("videoTotalViews");
    } else if (videoTotalViews < 0) {
      throw this.errors.InvalidAttribute(
        videoTotalViews,
        "videoTotalViews",
        "Video views cannot be negative."
      );
    }
    return true;
  };

  validateOrderBy = (orderBy) => {
    if (!orderBy) {
      throw this.errors.MissingQueryParameter("orderBy");
    } else if (
      orderBy !== "addedAtDesc" &&
      orderBy !== "addedAtAsc" &&
      orderBy !== "createdAtDesc" &&
      orderBy !== "createdAtAsc" &&
      orderBy !== "popularity" &&
      orderBy !== "custom"
    ) {
      throw this.errors.OrderByError();
    }
    return true;
  };

  validatePageNumber = (pageNumber) => {
    console.log({ pageNumber });
    if (pageNumber < 1) {
      throw this.errors.PageNumberError();
    } else if (!pageNumber) {
      throw this.errors.MissingQueryParameter("pageNumber");
    } else return true;
  };

  validatePageSize = (pageSize) => {
    if (pageSize < 1) {
      throw this.errors.PageSizeError();
    } else if (!pageSize) {
      throw this.errors.MissingQueryParameter("pageSize");
    }
    return true;
  };

  validateIndex = (index, maxIndex) => {
    if (index < 0 || index > maxIndex) {
      throw this.errors.IndexError();
    }
    return true;
  };

  validateAddVideoToPlaylistPayload = (payload) => {
    try {
      return (
        this.validatePlaylistId(payload.playlistId) &&
        this.validateVideoId(payload.videoId) &&
        this.validateVideoTitle(payload.videoTitle) &&
        this.validateVideoChannelName(payload.videoChannelName) &&
        this.validateVideoCreatedAt(payload.videoCreatedAt) &&
        this.validateVideoDuration(payload.videoDuration) &&
        this.validateVideoThumbnailUrl(payload.videoThumbnailUrl) &&
        this.validateVideoTotalViews(payload.videoTotalViews)
      );
    } catch (err) {
      throw err;
    }
  };

  validateGetVideosFromPlaylistPayload = (payload) => {
    try {
      return (
        this.validateOrderBy(payload.orderBy) &&
        this.validatePlaylistId(payload.playlistId) &&
        this.validatePageNumber(payload.page) &&
        this.validatePageSize(payload.limit)
      );
    } catch (err) {
      throw err;
    }
  };
}

module.exports = { PlaylistsValidators, VideosInPlaylistValidators };
