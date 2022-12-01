export interface Comment {
    commentId: string,
    parentCommentId: string | null,
    commentText: string,
    commentNetLikes: number,
    commentRepliesCount: number | null,
    commentCreatedAt: number,
    videoId: string,
    userId: string,
    channelName: string,
    userProfilePicture: string,
    likedByUser: boolean | null
}

// Data passed to create a new comment.
export interface CommentInitializer {
    commentText: string,
    userId: string,
    channelName: string,
    userProfilePicture: string
}