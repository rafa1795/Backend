const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const ProductModel = require("../models/product.model.js");

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await ProductModel.find().lean();
            res.render("products", { productos: products });
        } catch (error) {
            res.status(500).send("Error al obtener productos");
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await ProductModel.findById(productId).lean();
            if (!product) {
                return res.status(404).send("Producto no encontrado");
            }
            res.render("product", { product });
        } catch (error) {
            res.status(500).send("Error al obtener el producto");
        }
    }

    async addProduct(req, res) {
        try {
            const newProduct = new ProductModel(req.body);
            await newProduct.save();
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error al agregar producto");
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true }).lean();
            if (!updatedProduct) {
                return res.status(404).send("Producto no encontrado");
            }
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            const deletedProduct = await ProductModel.findByIdAndDelete(productId).lean();
            if (!deletedProduct) {
                return res.status(404).send("Producto no encontrado");
            }
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = ProductController;