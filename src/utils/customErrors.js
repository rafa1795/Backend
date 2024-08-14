class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const CustomErrors = {
    MISSING_FIELD: 'MISSING_FIELD',
    INVALID_TYPE: 'INVALID_TYPE',
    NOT_FOUND: 'NOT_FOUND',
};

const createCustomError = (code, message) => {
    return new CustomError(message, code);
};

module.exports = {
    CustomError,
    CustomErrors,
    createCustomError
};

