document.addEventListener("DOMContentLoaded", function () {
    const botonesAgregar = document.querySelectorAll(".add-to-cart-button");
  
    botonesAgregar.forEach((boton) => {
      boton.removeEventListener("click", agregarProductoAlCarrito);
      boton.addEventListener("click", agregarProductoAlCarrito);
    });
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
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }


























