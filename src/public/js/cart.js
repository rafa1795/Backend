document.addEventListener("DOMContentLoaded", function () {
    const botonesAgregar = document.querySelectorAll(".add-to-cart-button");
    const botonComprar = document.getElementById("boton-comprar");

    botonesAgregar.forEach((boton) => {
        boton.removeEventListener("click", agregarProductoAlCarrito);
        boton.addEventListener("click", agregarProductoAlCarrito);
    });

    if (botonComprar) {
        botonComprar.addEventListener("click", confirmarCompra);
    }
    });

    async function agregarProductoAlCarrito(event) {
        const productId = this.dataset.productId;
        const cartId = localStorage.getItem("cartId");
    
        console.log("Product ID:", productId);
        console.log("Cart ID:", cartId);
    
        if (!productId) {
            console.error("Error: el productId no se encuentra en el dataset del botón.");
            return;
        }
    
        if (!cartId) {
            console.error("Error: no se encontró el cartId en el localStorage.");
            return;
        }
    
        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: "POST",
            });
    
            if (!response.ok) {
                throw new Error("Error al agregar producto al carrito");
            }
    
            const data = await response.json();
            console.log("Producto agregado al carrito:", data);
    
            alert("Producto agregado al carrito exitosamente!");
    
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    }

async function confirmarCompra(event) {
    event.preventDefault();
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
        alert("No se encontró el ID del carrito en el almacenamiento local.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas confirmar la compra?")) {
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Error al realizar la compra");
            }

            const data = await response.json();
            console.log("Compra realizada:", data);

            window.location.href = `/checkout?nombre=${data.nombre}&email=${data.email}&numeroOrden=${data.numeroOrden}`;
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            alert("Hubo un error al realizar la compra.");
        }
    }
}














