document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const productId = event.target.dataset.productId;
            const cartId = localStorage.getItem("cartId");

            console.log("Product ID:", productId); 
            console.log("Cart ID:", cartId); 

            if (!productId) {
                console.error("Error: el productId no se encuentra en el dataset del botón.");
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                });

                if (!response.ok) {
                    throw new Error("Error al agregar producto al carrito");
                }

                console.log("Producto agregado al carrito");
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
            }
        });
    });
});





















