const GlobalConstants = require('./global.constants');

const VideoConstants = {
    ...GlobalConstants,
    VIDEO_TITLE_MAX_LENGTH: 100,
    VIDEO_DESCRIPTION_MAX_LENGTH: 5000,
    VIDEO_CATEGORY_MAX_LENGTH: 50,
    VIDEO_SEARCH_QUERY_MAX_LENGTH: 100
}

module.exports = VideoConstants;