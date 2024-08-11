const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");
const EmailManager = require('../services/email');
const emailManager = new EmailManager();

class CartController {
    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await CartModel.create({});
            res.status(201).json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error al crear el carrito");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await CartModel.findById(carritoId).populate("products.product");
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error al obtener los productos del carrito");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            if (!cartId || !productId) {
                return res.status(400).json({ message: "Cart ID and Product ID are required" });
            }

            const product = await productRepository.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const carritoActualizado = await cartRepository.agregarProducto(cartId, productId);
            if (!carritoActualizado) {
                return res.status(500).json({ message: "Failed to add product to cart" });
            }

            res.status(200).json({ message: "Product added to cart", cart: carritoActualizado });
        } catch (error) {
            console.error("Error en agregarProductoEnCarrito:", error);
            res.status(500).json({ message: "Error al agregar producto al carrito" });
        }
    }


    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarCantidad(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.vaciarCarrito(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;
    
            const productosNoDisponibles = [];
    
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }
    
            const userWithCart = await UserModel.findOne({ cart: cartId });
    
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            try {
                await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket.code);
            } catch (error) {
                console.error('Error al enviar el correo:', error);
            }
    
            cart.products = cart.products.filter(item => 
                productosNoDisponibles.some(productId => productId.equals(item.product))
            );
    
            await cart.save();
    
            res.json({
                mensaje: 'Compra realizada con éxito',
                nombre: userWithCart.first_name,
                email: userWithCart.email,
                numeroOrden: ticket.code,
                productosNoDisponibles
            });
    
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
}

module.exports = CartController;

