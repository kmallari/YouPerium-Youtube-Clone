const aws = require('../helpers/awsHelpers');
const { nanoid } = require("nanoid");
const { customAlphabet } = require("nanoid");
const nanoidAlphabet = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21);

class VideoModel {
    constructor(obj) {
        this.videoId = obj.videoId || nanoid(21);
        this.videoFilePath = obj.videoFilePath || `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/${this.videoId}.mp4`;
        this.videoThumbnailPath = obj.videoThumbnailPath || "";
        this.videoTitle = obj.videoTitle || `${obj.channelName}'s video`;
        this.videoDescription = obj.videoDescription || "No description";
        this.videoCategory = obj.videoCategory || "Music";
        this.videoCreatedAt = obj.videoCreatedAt || Math.floor(Date.now()/1000);
        this.videoTotalViews = obj.videoTotalViews || 0;
        this.videoDuration = obj.videoDuration;
        this.userId = obj.userId;
        this.channelName = obj.channelName;
        this.subscribersCount = obj.subscribersCount;
        this.userProfilePicture = obj.userProfilePicture || "No picture";
        if (this.videoThumbnailPath) {
            this.videoThumbnailId = this.videoThumbnailPath.slice(80).slice(this.videoThumbnailPath.length-4);
        } else {
            this.videoThumbnailId = ""
        }
    }

    getVideoResponse(message) {
        return {
            message,
            data: this
        }
    }

    getVideoDetails() {
		return {
			videoId: this.videoId,
            videoFilePath: this.videoFilePath,
            videoThumbnailPath: this.videoThumbnailPath,
			videoTitle: this.videoTitle,
			videoDescription: this.videoDescription,
			videoCategory: this.videoCategory,
			videoCreatedAt: this.videoCreatedAt,
			videoTotalViews: this.videoTotalViews,
			videoDuration: this.videoDuration,
			userId: this.userId,
			channelName: this.channelName,
			subscribersCount: this.subscribersCount,
            userProfilePicture: this.userProfilePicture
		};
    }

    async uploadVideo(videoFile) {
        await aws().uploadVideo(this.videoId, videoFile);
    }

    generateVideoThumbnailId() {
        this.videoThumbnailId = nanoid(21);
    }

    async uploadVideoThumbnail(image) {
        await aws().uploadVideoThumbnail(this.videoThumbnailId, image);
        console.log("Finished uploading)")
        this.videoThumbnailPath = `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/${this.videoThumbnailId}.jpg`
    }

}

module.exports = VideoModel;