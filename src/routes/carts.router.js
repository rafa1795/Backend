const express = require("express");
const router = express.Router(); 

const CartManager = require("../controllers/cartManagerDB.js");
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

module.exports = router; 