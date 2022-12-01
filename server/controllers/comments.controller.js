class CommentController {
	constructor(repository, CommentModel, CommentError, validators) {
		this.repository = repository;
		this.CommentModel = CommentModel;
		this.CommentError = CommentError;
		this.validators = validators;
	}

	createComment = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"commentText",
				"userId",
				"channelName",
				"userProfilePicture",
			]);

			const { videoId } = req.params;
			const { commentText, userId, channelName, userProfilePicture } =
				req.body;

			this.validators.validateAttributes({
				videoId,
				commentText,
				userId,
			});

			const commentModel = new this.CommentModel(
				{
					commentText,
					userId,
					channelName,
					userProfilePicture,
					videoId,
				},
				false
			);

			this.validators.validateComment(commentModel);

			const {
				commentId,
				commentNetLikes,
				commentRepliesCount,
				commentCreatedAt,
				parentCommentId,
			} = commentModel;
			const newCommentResponse = new this.CommentModel(
				(
					await this.repository.createComment(
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
					)
				)[0][0][0],
				true
			).getCommentResponse(
				`Successfully created comment ${commentId} in video ${videoId}`
			);
			return res.status(200).json(newCommentResponse);
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	createReply = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"commentText",
				"userId",
				"channelName",
				"userProfilePicture",
			]);

			let { videoId, commentId } = req.params;
			let { commentText, userId, channelName, userProfilePicture } =
				req.body;
			let parentCommentId = commentId;

			this.validators.validateAttributes({
				videoId,
				commentId,
				parentCommentId,
				commentText,
				userId,
			});

			const parentComment = new this.CommentModel(
				(
					await this.repository.readComment(
						videoId,
						parentCommentId,
						userId
					)
				)[0][0][0],
				true
			);
			
			// Since Youtube has 2-layer comment system only (layer 1 for root
			// comments, layer 2 for the replies to the root comments), then
			// if the user replied to another reply, we just set its parent
			// comment to be equal to the parent comment of the another reply.
			if (parentComment.parentCommentId) {
				parentCommentId = parentComment.parentCommentId;
			}

			const commentModel = new this.CommentModel(
				{
					commentText,
					videoId,
					userId,
					channelName,
					userProfilePicture,
					parentCommentId,
				},
				false
			);
			this.validators.validateComment(commentModel);

			commentId = commentModel.commentId;
			const { commentNetLikes, commentCreatedAt, commentRepliesCount } =
				commentModel;
			const newReplyResponse = new this.CommentModel(
				(
					await this.repository.createComment(
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
					)
				)[0][0][0],
				true
			).getCommentResponse(
				`Successfully created reply ${commentId} in comment ${parentCommentId}`
			);
			return res.status(200).json(newReplyResponse);
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readComment = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"userId",
			]);

			const { videoId, commentId } = req.params;
			const { userId } = req.query;
			this.validators.validateAttributes({ videoId, commentId, userId });

			const commentResponse = new this.CommentModel(
				(
					await this.repository.readComment(
						videoId,
						commentId,
						userId
					)
				)[0][0][0],
				true
			).getCommentResponse(
				`Successfully read the comment ${commentId} in video ${videoId}`
			);

			return res.status(200).json(commentResponse);
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readComments = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"userId",
				"sortBy",
				"offset",
				"limit",
			]);

			const { videoId } = req.params;
			let { userId, sortBy, offset, limit } = req.query;

			this.validators.validateAttributes({ videoId, userId });
			this.validators.validateNonAttributes({ offset, limit });

			offset = +offset;
			limit = +limit;

			const comments = (
				await this.repository.readComments(
					videoId,
					userId,
					sortBy,
					offset,
					limit
				)
			)[0][0];
			return res.status(200).json({
				message: `Successfully read the comments in video ${videoId}`,
				data: comments,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readReplies = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"userId",
			]);

			const { videoId, commentId } = req.params;
			const { userId } = req.query;

			this.validators.validateAttributes({ videoId, commentId, userId });

			const comment = new this.CommentModel(
				(
					await this.repository.readComment(
						videoId,
						commentId,
						userId
					)
				)[0][0][0],
				true
			);

			this.validators.validateRootComment(comment);

			const replies = (
				await this.repository.readReplies(videoId, commentId, userId)
			)[0][0];
			return res.status(200).json({
				message: `Successfully read the replies of comment ${commentId} in video ${videoId}`,
				data: replies,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	readVideoTotalNumberOfComments = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId"
			]);

			const { videoId } = req.params;
			this.validators.validateAttributes({ videoId });

			const totalNumberOfComments = (
				await this.repository.readVideoTotalNumberOfComments(videoId)
			)[0][0][0];
			return res.status(200).json({
				message: "Successfully read total number of comments",
				data: totalNumberOfComments
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	updateCommentText = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredRequestBodyFieldsExist(req.body, [
				"commentText",
			]);

			const { videoId, commentId } = req.params;
			const { commentText } = req.body;
			this.validators.validateAttributes({
				videoId,
				commentId,
				commentText,
			});

			let updatedCommentText = (
				await this.repository.updateCommentText(
					videoId,
					commentId,
					commentText
				)
			)[0][0][0];
			return res.status(200).json({
				message: `Successfully updated commentText of comment ${commentId}`,
				data: updatedCommentText,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	updateCommentNetLikes = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"userId",
				"increment",
			]);

			const { videoId, commentId } = req.params;
			let { userId, increment } = req.query;
			increment =
				increment === "true"
					? true
					: increment === "false"
					? false
					: increment;
			this.validators.validateAttributes({ videoId, commentId, userId });
			this.validators.validateNonAttributes({ increment });

			let updatedCommentLikes = (
				await this.repository.updateCommentNetLikes(
					videoId,
					commentId,
					userId,
					increment
				)
			)[0][0][0];
			return res.status(200).json({
				message: increment
					? `Successfully incremented commentNetLikes of comment ${commentId}`
					: `Successfully decremented commentNetLikes of comment ${commentId}`,
				data: updatedCommentLikes,
			});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};

	deleteComment = async (req, res) => {
		try {
			this.validators.checkRequiredParametersExist(req.params, [
				"videoId",
				"commentId",
			]);
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"userId",
			]);

			const { videoId, commentId } = req.params;
			const { userId } = req.query;
			this.validators.validateAttributes({ videoId, commentId, userId });

			const comment = new this.CommentModel(
				(
					await this.repository.readComment(
						videoId,
						commentId,
						userId
					)
				)[0][0][0],
				true
			);

			// This is a comment, its replies must also be deleted.
			if (comment.parentCommentId === null) {
				const deletedComments = (
					await this.repository.deleteCommentAndItsReplies(
						videoId,
						commentId,
						userId
					)
				)[0][0];
				return res.status(200).json({
					message: `Successfully deleted comment ${commentId} and its attached replies.`,
					data: deletedComments,
				});
			} else {
				const parentCommentId = comment.parentCommentId;
				const deletedReply = new this.CommentModel(
					(
						await this.repository.deleteReply(
							videoId,
							commentId,
							parentCommentId,
							userId
						)
					)[0][0][0],
					true
				);
				const deletedReplyResponse = deletedReply.getCommentResponse(
					`Successfully deleted reply ${commentId} in comment ${deletedReply.parentCommentId}`
				);
				return res.status(200).json(deletedReplyResponse);
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).json({
					customCode: error.customCode,
					message: error.message,
				});
			} else {
				console.log(error);
				return res.status(500).json(error);
			}
		}
	};
	
}

module.exports = CommentController;
