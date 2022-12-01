const CustomError = require('./CustomError');
const GlobalError = require('./global.error');

// customCode range: [40001, 41000]
class VideoErrors extends GlobalError {
    // Code 400: Client made a mistake in its request form.
    static InvalidQueryTypeValue = (val) => new CustomError(400, `Invalid queryType value: ${val}.`, 40001);
    static InvalidAttribute = (attr, attrName, reason) => new CustomError(400, `Invalid ${attrName}: ${attr}. Reason: ${reason}`, 40002);
    static InvalidTimeRange = () => new CustomError(400, `Invalid timeRange.`, 40003);
    static InvalidNonAttribute = (attr, attrName, reason) => new CustomError(400, `Invalid ${attrName}: ${attr}. Reason: ${reason}`, 40004);

    // Code 404: Missing resource error.
    static VideoNotFound = () => new CustomError(404, `Video not found.`, 40101);
    static UserNotFound = () => new CustomError(404, `User not found.`, 40102);
}

module.exports = VideoErrors;