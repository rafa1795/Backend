document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-product-id');
        
        const cartId = window.currentUser.cartId;

        if (!cartId) {
            console.error('No se pudo obtener el ID del carrito');
            return;
        }

        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Producto agregado al carrito');
            } else {
                console.error('Error al agregar producto al carrito');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
