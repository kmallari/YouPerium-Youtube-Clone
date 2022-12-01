const CustomError = require('./CustomError');
const GlobalError = require('./global.error');

// customCode range: [41001, 42000]
class CommentErrors extends GlobalError {
    // Code 400: Client made a mistake in its request form.
    static InvalidAttribute = (attr, attrName, reason) => new CustomError(400, `Invalid ${attrName}: ${attr}. Reason: ${reason}`, 41001);
    static InvalidAction = (reason) => new CustomError(400, `Invalid action. Reason: ${reason}`, 41002);
    static InvalidNonAttribute = (nonAttr, nonAttrName, reason) => new CustomError(400, `Invalid ${nonAttrName}: ${nonAttr}. Reason: ${reason}`, 41003);

    // Code 404: Resource missing.
    static CommentNotFound = () => new CustomError(404, 'Comment not found.', 41101);
    static ParentCommentNotFound = () => new CustomError(404, 'Parent comment not found.', 41102);
    static VideoNotFound = () => new CustomError(404, 'Video not found.', 41103);
    static UserNotFound = () => new CustomError(404, 'User not found.', 41104);
}

module.exports = CommentErrors;