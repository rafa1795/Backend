const Product = require('../models/product.model');

class ProductRepository {
    async obtenerProductos() {
        return await Product.find();
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(product) {
        return await Product.create(product);
    }

    async updateProduct(id, product) {
        return await Product.findByIdAndUpdate(id, product, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductRepository;
