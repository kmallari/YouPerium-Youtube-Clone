const { nanoid } = require("nanoid");

class Playlist {
  constructor(
    title,
    description,
    thumbnailUrl,
    creatorId,
    creatorChannelName,
    creatorIconUrl
  ) {
    this.id = nanoid(21);
    this.title = title;
    this.description = description;
    this.numberOfVideos = 0;
    this.thumbnailUrl = thumbnailUrl;
    this.creatorId = creatorId;
    this.creatorChannelName = creatorChannelName;
    this.creatorIconUrl = creatorIconUrl;
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
  }
  getId() {
    return this.id;
  }
  async getPlaylistDetails() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      numberOfVideos: this.numberOfVideos,
      thumbnailUrl: this.thumbnailUrl,
      creatorId: this.creatorId,
      creatorChannelName: this.creatorChannelName,
      creatorIconUrl: this.creatorIconUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

class VideosInPlaylist {
  constructor(
    playlistId,
    videoId,
    videoTitle,
    videoChannelName,
    videoCreatedAt,
    videoDuration,
    videoThumbnailUrl,
    videoTotalViews
  ) {
    this.nanoid = nanoid(21);
    this.playlistId = playlistId;
    this.videoId = videoId;
    this.videoTitle = videoTitle;
    this.videoChannelName = videoChannelName;
    this.videoCreatedAt = videoCreatedAt;
    this.videoDuration = videoDuration;
    this.videoThumbnailUrl = videoThumbnailUrl || 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg';
    this.videoTotalViews = videoTotalViews;
    this.addedAt = Date.now();
  }

  async getVideoInPlaylistDetails() {
    return {
      id: `${this.playlistId}-${this.videoId}`,
      playlistId: this.playlistId,
      videoId: this.videoId,
      videoTitle: this.videoTitle,
      videoChannelName: this.videoChannelName,
      videoCreatedAt: this.videoCreatedAt,
      videoDuration: this.videoDuration,
      videoThumbnailUrl: this.videoThumbnailUrl,
      videoTotalViews: this.videoTotalViews,
      addedAt: this.addedAt,
    };
  }
}

module.exports = { Playlist, VideosInPlaylist };
