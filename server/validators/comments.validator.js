const Validators = require("./validator");

class CommentsValidators extends Validators {
	constructor(errors, constants) {
		super(errors);
		this.constants = constants;
	}

	validateRootComment = (comment) => {
		if (comment.parentCommentId) {
			throw this.errors.InvalidAction(
				'The provided "root" comment is already a reply to another root comment.'
			);
		}

		if (comment.CommentRepliesCount === 0) {
			throw this.errors.InvalidAction("The comment has no replies.");
		}
	};

	validateComment = (comment) => {
		this._validateCommentId(comment.commentId);
		this._validateParentCommentId(comment.parentCommentId);
		this._validateCommentText(comment.commentText);
		this._validateCommentNetLikes(comment.commentNetLikes);
		this._validateCommentRepliesCount(comment.commentRepliesCount);
		this._validateCommentCreatedAt(comment.commentCreatedAt);
		this._validateVideoId(comment.videoId);
		this._validateUserId(comment.userId);
		this._validateLikedByUser(comment.likedByUser);
	};

	validateAttributes = (attributes) => {
		Object.keys(attributes).forEach((attributeName) => {
			switch (attributeName) {
				case "commentId":
					this._validateCommentId(attributes[attributeName]);
					break;

				case "parentCommentId":
					this._validateParentCommentId(attributes[attributeName]);
					break;

				case "commentText":
					this._validateCommentText(attributes[attributeName]);
					break;

				case "commentNetLikes":
					this._validateCommentNetLikes(attributes[attributeName]);
					break;

				case "commentRepliesCount":
					this._validateCommentRepliesCount(attributes[attributeName]);
					break;

				case "commentCreatedAt":
					this._validateCommentCreatedAt(attributes[attributeName]);
					break;

				case "videoId":
					this._validateVideoId(attributes[attributeName]);
					break;

				case "userId":
					this._validateUserId(attributes[attributeName]);
					break;

				case "likedByUser":
					this._validateLikedByUser(attributes[attributeName]);
					break;

				default:
					throw this.errors.InvalidAttributeName(attributeName);
			}
		});
	};

	validateNonAttributes = (nonAttributes) => {
		Object.keys(nonAttributes).forEach((attributeName) => {
			switch (attributeName) {
				case "increment":
					this._validateIncrement(nonAttributes[attributeName]);
					break;

				case "offset":
					this._validateOffset(nonAttributes[attributeName]);
					break;

				case "limit":
					this._validateLimit(nonAttributes[attributeName]);
					break;

				default:
					throw this.errors.InvalidAttributeName(attributeName);
			}
		});
	};

	// Attribute validators

	_validateCommentId = (commentId) => {
		let type = typeof commentId;
		if (type !== "string") {
			throw this.errors.InvalidType("commentId", type, "string");
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{21}$/);
		if (!rgx.test(commentId)) {
			throw this.errors.InvalidAttribute(
				commentId,
				"commentId",
				"Failed to match regex pattern."
			);
		}
	};

	_validateParentCommentId = (parentCommentId) => {
		if (parentCommentId === null) {
			return;
		}

		let type = typeof parentCommentId;
		if (type !== "string") {
			throw this.errors.InvalidType("parentCommentId", type, "string");
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{21}$/);
		if (!rgx.test(parentCommentId)) {
			throw this.errors.InvalidAttribute(
				parentCommentId,
				"parentCommentId",
				"Failed to match regex pattern."
			);
		}
	};

	_validateCommentText = (commentText) => {
		let type = typeof commentText;
		if (type !== "string") {
			throw this.errors.InvalidType("commentText", type, "string");
		}

		if (
			!commentText.length ||
			commentText.length > this.constants.COMMENT_TEXT_MAX_LENGTH
		) {
			throw this.errors.InvalidAttribute(
				commentText,
				"commentText",
				"Invalid length."
			);
		}
	};

	_validateCommentNetLikes = (commentNetLikes) => {
		let type = typeof commentNetLikes;
		if (type !== "number") {
			throw this.errors.InvalidType("commentNetLikes", type, "number");
		}

		if (!Number.isInteger(commentNetLikes)) {
			throw this.errors.InvalidAttribute(
				commentNetLikes,
				"commentNetLikes",
				"commentNetLikes must be an integer number."
			);
		}
	};

	_validateCommentRepliesCount = (commentRepliesCount) => {
		if (commentRepliesCount === null) {
			return;
		}

		let type = typeof commentRepliesCount;
		if (type !== "number") {
			throw this.errors.InvalidType("commentRepliesCount", type, "number");
		}

		if (!Number.isInteger(commentRepliesCount) || commentRepliesCount < 0) {
			throw this.errors.InvalidAttribute(
				commentRepliesCount,
				"commentRepliesCount",
				"commentRepliesCount must be null or a positive integer-type number."
			);
		}
	};

	_validateCommentCreatedAt = (commentCreatedAt) => {
		let type = typeof commentCreatedAt;
		if (type !== "number") {
			throw this.errors.InvalidType("commentCreatedAt", type, "number");
		}

		if (!Number.isInteger(commentCreatedAt) || commentCreatedAt < 0) {
			throw this.errors.InvalidAttribute(
				commentCreatedAt,
				"commentCreatedAt",
				"commentCreatedAt must be a positive integer-type number."
			);
		}
	};

	_validateVideoId = (videoId) => {
		let type = typeof videoId;
		if (type !== "string") {
			throw this.errors.InvalidType("videoId", type, "string");
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{21}$/);
		if (!rgx.test(videoId)) {
			throw this.errors.InvalidAttribute(
				videoId,
				"videoId",
				"Failed to match regex pattern."
			);
		}
	};

	_validateUserId = (userId) => {
		let type = typeof userId;
		if (type !== "string") {
			throw this.errors.InvalidType("userId", type, "string");
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{21}$/);
		if (!rgx.test(userId)) {
			throw this.errors.InvalidAttribute(
				userId,
				"userId",
				"Failed to match regex pattern."
			);
		}
	};

	_validateLikedByUser = (likedByUser) => {
		if (likedByUser !== null && typeof likedByUser !== "boolean") {
			throw this.errors.InvalidNonAttribute(
				likedByUser,
				"likedByUser",
				"likedByUser must be boolean or null type."
			);
		}
	};

	// Non-attribute validators

	_validateIncrement(increment) {
		if (typeof increment !== "boolean") {
			throw this.errors.InvalidNonAttribute(
				increment,
				"increment",
				"increment does not contain a boolean value."
			);
		}
	}

	_validateOffset = (offset) => {
		offset = +offset;
		if (isNaN(offset)) {
			throw this.errors.InvalidAttribute(
				offset,
				"offset",
				"Invalid type."
			);
		}

		if (!Number.isInteger(offset) || offset < 0) {
			throw this.errors.InvalidAttribute(
				offset,
				"offset",
				"offset must be a positive integer-type number."
			);
		}
	};

	_validateLimit = (limit) => {
		limit = +limit;
		if (isNaN(+limit)) {
			throw this.errors.InvalidAttribute(limit, "limit", "Invalid type.");
		}

		if (!Number.isInteger(limit) || limit < 1) {
			throw this.errors.InvalidAttribute(
				limit,
				"limit",
				"limit must be a positive integer-type number >= 1."
			);
		}
	};
}

module.exports = CommentsValidators;
