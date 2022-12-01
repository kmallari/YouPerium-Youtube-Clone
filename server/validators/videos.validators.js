const Validators = require("./validator");

class VideosValidators extends Validators {
	constructor(errors, constants) {
		super(errors);
		this.constants = constants;
	}

	validateVideo = (video) => {
		try {
			this._validateVideoId(video.videoId);
			this._validateVideoThumbnailId(video.videoThumbnailId);
			this._validateVideoTitle(video.videoTitle);
			this._validateVideoCategory(video.videoCategory);
			this._validateVideoDescription(video.videoDescription);
			this._validateVideoCreatedAt(video.videoCreatedAt);
			this._validateVideoTotalViews(video.videoTotalViews);
			this._validateVideoDuration(video.videoDuration);
			this._validateUserId(video.userId);
		} catch (error) {
			throw error;
		}
	};

	// isReading determines if the action performing the validation
	// is reading from the videos table and not modifying its content.
	validateAttributes = (attributes, isReading) => {
		Object.keys(attributes).forEach((attributeName) => {
			switch (attributeName) {
				case "videoId":
					this._validateVideoId(attributes[attributeName]);
					break;

				case "videoThumbnailId":
					this._validateVideoThumbnailId(attributes[attributeName]);
					break;

				case "videoTitle":
					this._validateVideoTitle(attributes[attributeName]);
					break;

				case "videoDescription":
					this._validateVideoDescription(attributes[attributeName]);
					break;

				case "videoCategory":
					this._validateVideoCategory(
						attributes[attributeName],
						isReading
					);
					break;

				case "videoCreatedAt":
					this._validateVideoCreatedAt(attributes[attributeName]);
					break;

				case "videoTotalViews":
					this._validateVideoTotalViews(attributes[attributeName]);
					break;

				case "videoDuration":
					this._validateVideoDuration(attributes[attributeName]);

				case "userId":
					this._validateUserId(attributes[attributeName]);
					break;

				default:
					throw this.errors.InvalidAttributeName(attributeName);
			}
		});
	};

	validateNonAttributes = (nonAttributes, extraParams) => {
		Object.keys(nonAttributes).forEach((attrName) => {
			switch (attrName) {
				case "sortBy":
					this._validateSortBy(
						nonAttributes[attrName],
						extraParams.validSortByValues
					);
					break;

				case "asc":
					this._validateAsc(nonAttributes[attrName]);
					break;

				case "offset":
					this._validateOffset(nonAttributes[attrName]);
					break;

				case "limit":
					this._validateLimit(nonAttributes[attrName]);
					break;

				case "timeRange":
					this._validateTimeRange(nonAttributes[attrName]);
					break;

				case "searchQuery":
					this._validateSearchQuery(nonAttributes[attrName]);
					break;

				default:
					throw this.errors.InvalidAttributeName(attrName);
			}
		});
	};

	// Attributes Validation Methods

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

	_validateVideoThumbnailId = (videoThumbnailId) => {
		let type = typeof videoThumbnailId;
		if (type !== "string") {
			throw this.errors.InvalidType("videoThumbnailId", type, "string");
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{21}$/);
		if (!rgx.test(videoThumbnailId)) {
			throw this.errors.InvalidAttribute(
				videoThumbnailId,
				"videoThumbnailId",
				"Failed to match regex pattern."
			);
		}
	};

	_validateVideoTitle = (videoTitle) => {
		let type = typeof videoTitle;
		if (type !== "string") {
			throw this.errors.InvalidType("videoTitle", type, "string");
		}

		if (
			!videoTitle.length ||
			videoTitle.length > this.constants.VIDEO_TITLE_MAX_LENGTH
		) {
			throw this.errors.InvalidAttribute(
				videoTitle,
				"videoTitle",
				"Invalid length."
			);
		}
	};

	_validateVideoDescription = (videoDescription) => {
		let type = typeof videoDescription;
		if (type !== "string") {
			throw this.errors.InvalidType("videoDescription", type, "string");
		}

		if (
			!videoDescription.length ||
			videoDescription.length >
				this.constants.VIDEO_DESCRIPTION_MAX_LENGTH
		) {
			throw this.errors.InvalidAttribute(
				videoDescription,
				"videoDescription",
				"Invalid length."
			);
		}
	};

	_validateVideoCategory = (videoCategory, isReading) => {
		let type = typeof videoCategory;
		if (type !== "string") {
			throw this.errors.InvalidType("videoCategory", type, "string");
		}

		if (!isReading && videoCategory === "all") {
			throw this.errors.InvalidAttribute(
				videoCategory,
				"videoCategory",
				"Cannot use 'all' as videoCategory."
			);
		}

		const rgx = new RegExp(/^[A-Za-z0-9_-]{0, 50}/);
		if (rgx.test(videoCategory)) {
			throw this.errors.InvalidAttribute(
				videoCategory,
				"videoCategory",
				"Failed to match regex pattern."
			);
		}
	};

	_validateVideoCreatedAt = (videoCreatedAt) => {
		let type = typeof videoCreatedAt;
		if (type !== "number") {
			throw this.errors.InvalidType("videoCreatedAt", type, "number");
		}

		if (!Number.isInteger(videoCreatedAt) || videoCreatedAt < 0) {
			throw this.errors.InvalidAttribute(
				videoCreatedAt,
				"videoCreatedAt",
				"videoCreatedAt must be a positive integer-type number."
			);
		}
	};

	_validateVideoTotalViews = (videoTotalViews) => {
		let type = typeof videoTotalViews;
		if (type !== "number") {
			throw this.errors.InvalidType("videoTotalViews", type, "number");
		}

		if (!Number.isInteger(videoTotalViews) || videoTotalViews < 0) {
			throw this.errors.InvalidAttribute(
				videoTotalViews,
				"videoTotalViews",
				"videoTotalViews must be a positive integer-type number."
			);
		}
	};

	_validateVideoDuration = (videoDuration) => {
		let type = typeof videoDuration;
		if (type !== "number") {
			throw this.errors.InvalidType("videoDuration", type, "number");
		}

		if (!Number.isInteger(videoDuration) || videoDuration < 0) {
			throw this.errors.InvalidAttribute(
				videoDuration,
				"videoDuration",
				"videoDuration must be a positive integer-type number."
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

	// Non-attributes validation methods

	_validateSortBy = (sortBy, validSortByValues) => {
		if (!validSortByValues.includes(sortBy)) {
			throw this.errors.InvalidNonAttribute(
				sortBy,
				"sortBy",
				`sortBy must have one of the following valid values: ${validSortByValues}.`
			);
		}
	};

	_validateAsc = (asc) => {
		if (typeof asc !== "boolean") {
			throw this.errors.InvalidNonAttribute(
				asc,
				"asc",
				"asc must be boolean type."
			);
		}
	};

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

	_validateTimeRange = (timeRange) => {
		if (!["today", "thisWeek", "thisMonth", "older"].includes(timeRange)) {
			throw this.errors.InvalidAttribute(
				timeRange,
				"timeRange",
				"timeRange must have one of the following valid values: ['today', 'thisWeek', 'thisMonth', 'older']."
			);
		}
	};

	_validateSearchQuery = (searchQuery) => {
		let type = typeof searchQuery;
		if (type !== "string") {
			throw this.errors.InvalidType("searchQuery", "string");
		}

		if (searchQuery.length > this.constants.VIDEO_SEARCH_QUERY_MAX_LENGTH) {
			throw this.errors.InvalidNonAttribute(
				searchQuery,
				"searchQuery",
				`searchQuery exceeds its max length of ${this.constants.VIDEO_SEARCH_QUERY_MAX_LENGTH}`
			);
		}
	};
}

module.exports = VideosValidators;
