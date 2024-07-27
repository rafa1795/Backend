const CartModel = require("../models/cart.model.js");
const ProductModel = require("../models/product.model.js");

class CartRepository {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async obtenerProductosDeCarrito(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito).populate('products.product', 'title price');
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            throw new Error("Error al obtener los productos del carrito");
        }
    }

    async agregarProducto(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.obtenerProductosDeCarrito(cartId);
            const producto = await ProductModel.findById(productId);
        
            if (!producto) {
                throw new Error("Producto no encontrado");
            }
        
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);
        
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({
                    product: productId,
                    title: producto.title,
                    price: producto.price,
                    quantity
                });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Error al agregar producto al carrito");
        }
    }

    async eliminarProducto(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async actualizarProductosEnCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }

        } catch (error) {
            throw new Error("Error al actualizar las cantidades");
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;

        } catch (error) {
            throw new Error("Error");
        }
    }
}

module.exports = CartRepository;






