export interface Video {
    videoId: string,
    videoFilePath: string, 
    videoThumbnailPath: string,
    videoThumbnailId: string, // Deprecated; will be removed
    videoTitle: string,
    videoDescription: string,
    videoCategory: string,
    videoCreatedAt: number,
    videoTotalViews: number,
    videoDuration: number,
}

export interface VideoListing extends Video {
    userId: string,
    channelName: string,
    subscribersCount: number,
    userProfilePicture: string
}

export interface ReceivedVideo {
    message: string,
    data: VideoListing,
    error?: string
}

export interface ReceivedVideoListing {
    message: string,
    data: VideoListing[]
}

export interface VideoForPlaylist {
    videoId: string,
    videoThumbnailUrl?: string,
    videoTitle: string,
    videoDescription: string,
    videoCategory: string,
    videoCreatedAt: number,
    videoTotalViews: number,
    videoDuration: number,
    userId: string,
    subscribersCount: number,
    userProfilePicture: string,
    videoChannelName: string
}