const ProductModel = require('../models/product.model.js');

class ProductRepository {
    async obtenerProductos() {
        return await Product.find();
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async obtenerProductoPorId(productId) {
        try {
            return await ProductModel.findById(productId);
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    async addProduct(product) {
        return await ProductModel.create(product);
    }

    async updateProduct(id, product) {
        return await ProductModel.findByIdAndUpdate(id, product, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

module.exports = ProductRepository;
