document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            const quantity = 1; 

            try {
                await agregarProductoAlCarrito(productId, quantity);
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
            }
        });
    });
});

async function agregarProductoAlCarrito(productId, quantity) {
    try {
        const response = await fetch(`/api/carts/cart456/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            throw new Error('Error al agregar producto al carrito');
        }

        const data = await response.json();
        console.log('Producto agregado al carrito:', data);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
    }
}
