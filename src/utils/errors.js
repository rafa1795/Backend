class CustomError extends Error {
    constructor(name, message, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

const Errors = {
    ValidationError: (missingFields) => {
        return new CustomError('ValidationError', `Faltan los campos requeridos: ${missingFields.join(', ')}`, 400);
    },
    ProductNotFoundError: (id) => {
        return new CustomError('ProductNotFoundError', `No se encontró el producto con ID: ${id}`, 404);
    },
    CartError: (message) => {
        return new CustomError('CartError', message, 500);
    },

};

module.exports = { CustomError, Errors };
