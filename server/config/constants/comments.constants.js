const GlobalError = require("./global.constants");

const CommentConstants = {
    ...GlobalError,
    COMMENT_TEXT_MAX_LENGTH: 10000
};

module.exports = CommentConstants;