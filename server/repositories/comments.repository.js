class CommentsRepository {
	constructor(db, CommentError) {
		this.db = db;
		this.CommentError = CommentError;
	}

	createComment = async (
		commentId,
		commentText,
		commentNetLikes,
		commentRepliesCount,
		commentCreatedAt,
		parentCommentId,
		videoId,
		userId,
		channelName,
		userProfilePicture
	) => {
		try {
			return await this.db.raw(
				"CALL CreateComment(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[
					commentId,
					commentText,
					commentNetLikes,
					commentRepliesCount,
					commentCreatedAt,
					parentCommentId,
					videoId,
					userId,
					channelName,
					userProfilePicture,
				]
			);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readComment = async (videoId, commentId, userId) => {
		try {
			return await this.db.raw("CALL ReadComment(?, ?, ?)", [
				videoId,
				commentId,
				userId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readComments = async (videoId, userId, sortBy, offset, limit) => {
		try {
			return await this.db.raw("CALL ReadComments(?, ?, ?, ?, ?)", [
				videoId,
				userId,
				sortBy,
				offset,
				limit,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readReplies = async (videoId, commentId, userId) => {
		try {
			return await this.db.raw("CALL ReadReplies(?, ?, ?)", [
				videoId,
				commentId,
				userId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	readVideoTotalNumberOfComments = async (videoId) => {
		try {
			return await this.db.raw("CALL ReadVideoTotalNumberOfComments(?)", [
				videoId,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	updateCommentText = async (videoId, commentId, commentText) => {
		try {
			return await this.db.raw("CALL UpdateCommentText(?, ?, ?)", [
				videoId,
				commentId,
				commentText,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	updateCommentNetLikes = async (videoId, commentId, userId, increment) => {
		try {
			return await this.db.raw("CALL UpdateCommentNetLikes(?, ?, ?, ?)", [
				videoId,
				commentId,
				userId,
				increment,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	deleteCommentAndItsReplies = async (videoId, commentId, userId) => {
		try {
			let deletedComments = await this.db.raw(
				"CALL ReadDeletedCommentAndItsReplies(?, ?, ?)",
				[videoId, commentId, userId]
			);
			await this.db.raw("CALL DeleteCommentAndItsReplies(?, ?)", [
				videoId,
				commentId,
			]);
			return deletedComments;
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	deleteReply = async (videoId, commentId, parentCommentId, userId) => {
		try {
			let deletedReply = await this.db.raw("CALL ReadComment(?, ?, ?)", [
				videoId,
				commentId,
				userId,
			]);
			await this.db.raw("CALL DeleteReply(?, ?, ?)", [
				videoId,
				commentId,
				parentCommentId,
			]);
			return deletedReply;
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	updateCommentCreatorData = async (
		userId,
		channelName,
		userProfilePicture
	) => {
		try {
			return await this.db.raw("CALL UpdateCommentCreatorData(?, ?, ?)", [
				userId,
				channelName || null,
				userProfilePicture || null,
			]);
		} catch (error) {
			throw this._handleDBError(error);
		}
	};

	_handleDBError = (error) => {
		if (error.sqlMessage == null || error.errno == null) {
			return error;
		}

		if (error.sqlMessage === "Comment not found") {
			return this.CommentError.CommentNotFound();
		}

		if (error.sqlMessage === "Parent comment not found") {
			return this.CommentError.ParentCommentNotFound();
		}

		if (error.sqlMessage === "Video not found") {
			return this.CommentError.VideoNotFound();
		}

		if (error.sqlMessage === "User not found") {
			return this.CommentError.UserNotFound();
		}

		if (error.sqlMessage === "Invalid sortBy") {
			return this.CommentError.InvalidQueryParameter("sortBy");
		}

		if (error.errno === 1062) {
			const attributeName = getNameOfDupAttribute(error.sqlMessage);
			return this.CommentError.DuplicateAttributeValue(attributeName);

			function getNameOfDupAttribute(errorMessage) {
				const removedQuotes = errorMessage.split("'");
				return removedQuotes[removedQuotes.length - 2];
			}
		}

		return this.CommentError.UnhandledServerError(error);
	};
}

module.exports = CommentsRepository;
