document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const body = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        age: formData.get("age")
    };

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.redirected) {
            // Extraer el cartId de la URL
            const url = new URL(response.url);
            const cartId = url.searchParams.get("cartId");

            if (cartId) {
                localStorage.setItem("cartId", cartId);
                window.location.href = url.pathname; // Redirigir al perfil del usuario
            }
        } else {
            throw new Error("Error en el registro");
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
    }
});
