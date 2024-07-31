const ProductRepository = require('../repositories/product.repository.js');

class ProductController {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async obtenerProductos(req, res) {
        try {
            const productos = await this.productRepository.getProducts();
            res.render('products', { products: productos });
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await this.productRepository.getProductById(pid);
            res.json(product);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async addProduct(req, res) {
        try {
            const newProduct = req.body;
            const product = await this.productRepository.addProduct(newProduct);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedProduct = req.body;
            const product = await this.productRepository.updateProduct(pid, updatedProduct);
            res.json(product);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            await this.productRepository.deleteProduct(pid);
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = ProductController;
