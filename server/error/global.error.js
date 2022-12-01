const CustomError = require('./CustomError');

class GlobalError {
    // Code 400: Client made a mistake in its request form.
    static MissingParameter = (paramName) => new CustomError(400, `Missing required route parameter: ${paramName}.`, 60001);
    static InvalidParameter = (param) => new CustomError(400, `Invalid parameter: ${param}.`, 60002);
    static MissingQueryParameter = (queryParamName) => new CustomError(400, `Missing required query parameter: ${queryParamName}.`, 60003);
    static NullAttribute = (attributeName) => new CustomError(400, `Required attribute is null: ${attributeName}.`, 60004);
    static DuplicateAttributeValue = (attributeName) => new CustomError(400, `The provided value for ${attributeName} is already used by another entity.`, 60005);
    static InvalidAttributeName = (attributeName) => new CustomError(400, `Invalid attribute name: ${attributeName}`, 60006);
    static MissingRequestBodyField = (fieldName) => new CustomError(400, `Missing request body field: ${fieldName}`, 60007);
    static InvalidType = (paramName, paramType, correctType) => new CustomError(400, `${paramName} is type ${paramType}, should be type ${correctType}.`, 60008);
    static InvalidQueryParameter = (qparam) => new CustomError(400, `Invalid query parameter: ${qparam}.`, 60009);
    static InvalidAttribute = (value, attributeName, message) => new CustomError(400, `Invalid attribute: ${attributeName} = ${value}. ${message}`, 60010);

    // Code 500: Error unhandled by the server.
    static UnhandledServerError = (err) => new CustomError(500, `Unhandled server error: ${err}`, 69001);
}

module.exports = GlobalError;