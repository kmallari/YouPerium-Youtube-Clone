export interface Playlist {
  playlistId: string;
  title: string;
  description: string;
  numberOfVideos: number;
  thumbnailUrl: string;
  creatorId: string;
  creatorChannelName: string;
  creatorIconUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface videosInPlaylist {
  id: string;
  playlistId: string;
  videoId: string;
  videoTitle: string;
  videoChannelName: string;
  videoCreatedAt: number;
  videoDuration: number;
  videoThumbnailUrl: string;
  videoTotalViews: number;
  videoIndex: number;
  addedAt: number;
}

export interface ReceivedPlaylists {
  message: string;
  data: [
    {
      playlistId: string;
      title: string;
      description: string;
      numberOfVideos: number;
      thumbnailUrl: string;
      creatorId: string;
      creatorChannelName: string;
      creatorIconUrl: string;
      createdAt: number;
      updatedAt: number;
      id?:string;
    }
  ];
}

export interface ReceivedPlaylist {
  message: string;
  data: {
    playlistId: string;
    title: string;
    description: string;
    numberOfVideos: number;
    thumbnailUrl: string;
    creatorId: string;
    creatorChannelName: string;
    creatorIconUrl: string;
    createdAt: number;
    updatedAt: number;
    id?:string;
  };
}

export interface ReceivedVideosInPlaylist {
  message: string;
  data: videosInPlaylist[];
}

export interface playlistIdOnly {
    playlistId: string;
    videoIndex: number;
}
export interface PlaylistsWithVideo {
    message: string;
    data: playlistIdOnly[];
  }

export interface ReceivedVideo {
message: string;
data: {
    id: string;
    playlistId: string;
    videoId: string;
    videoTitle: string;
    videoChannelName: string;
    videoCreatedAt: number;
    videoDuration: number;
    videoThumbnailUrl: string;
    videoTotalViews: number;
    addedAt: number;
};
}