class Validators {
    constructor (errors){
        this.errors = errors
    }

    checkRequiredParametersExist(params, requiredParamNames) {
        for (let i = 0; i < requiredParamNames.length; i++) {
            const requiredParamName = requiredParamNames[i];
            if (params[requiredParamName] == null) {
                throw this.errors.MissingParameter(requiredParamName);
            }
        }
    }

    checkRequiredQueryParametersExist(qparams, requiredQParamNames) {
        for (let i = 0; i < requiredQParamNames.length; i++) {
            const requireQParamName = requiredQParamNames[i];
            if (qparams[requireQParamName] == null) {
                throw this.errors.MissingQueryParameter(requireQParamName);
            }
        }
    }
    
    checkRequiredRequestBodyFieldsExist(body, requiredFieldNames) {
        for (let i = 0; i < requiredFieldNames.length; i++) {
            const fieldName = requiredFieldNames[i];
            if (body[fieldName] == null) {
                throw this.errors.MissingRequestBodyField(fieldName);
            }
        }
    }

    InvalidAttribute(value, attributeName, message) {
        return new InvalidAttribute(value, attributeName, message);
    }
}

module.exports = Validators;