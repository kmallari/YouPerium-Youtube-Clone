const { nanoid } = require("nanoid");

class CommentModel {
	constructor(obj, inDB) {
		if (inDB) {
			this.commentId = obj.commentId;
			this.parentCommentId = obj.parentCommentId || null;
			this.commentText = obj.commentText;
			this.commentNetLikes = obj.commentNetLikes;
			this.commentRepliesCount =
				this.parentCommentId === null ? obj.commentRepliesCount : null;
			this.commentCreatedAt = obj.commentCreatedAt;
			this.videoId = obj.videoId;
			this.userId = obj.userId;
			this.channelName = obj.channelName;
			this.userProfilePicture = obj.userProfilePicture;
			this.likedByUser =
				obj.likedByUser === 1
					? true
					: obj.likedByUser === null
					? null
					: false;
		} else {
			this.commentId = nanoid(21);
			this.parentCommentId = obj.parentCommentId || null;
			this.commentText = obj.commentText;
			this.commentNetLikes = 0;
			this.commentRepliesCount = this.parentCommentId === null ? 0 : null;
			this.commentCreatedAt = Math.floor(Date.now() / 1000);
			this.videoId = obj.videoId;
			this.userId = obj.userId;
			this.channelName = obj.channelName;
			this.userProfilePicture = obj.userProfilePicture;
			this.likedByUser = null;
		}
	}

	getCommentResponse(message) {
		return {
			message,
			data: this,
		};
	}
}

module.exports = CommentModel;
