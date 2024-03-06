
const fs = require('fs');

class ProductManager {
    static ultId = 0;

    constructor() {
        this.products = [];
        this.path = './products.json';
        this.loadProductsFromFile(); 
        this.createFileIfNotExists();
    }

    addProduct(title, descripcion, price, imagen, code, stock) {
        if (!title || !descripcion || !price || !imagen || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("Ya existe un producto con el mismo código");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            descripcion,
            price,
            imagen,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.saveProductsToFile();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);
        if (!product) {
            console.log("Producto no encontrado");
        } else {
            console.log("Producto encontrado!", product);
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.log("Producto no encontrado");
            return;
        }

        this.products[index] = {
            ...this.products[index],
            ...updatedFields
        };

        this.saveProductsToFile();
        console.log("Producto actualizado:", this.products[index]);
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.log("Producto no encontrado");
            return;
        }

        this.products.splice(index, 1);
        this.saveProductsToFile();
        console.log("Producto eliminado");
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log("Productos cargados desde el archivo.");
        } catch (err) {
            console.error("Error al cargar productos desde el archivo:", err);
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
            console.log("Productos guardados en el archivo.");
        } catch (err) {
            console.error("Error al guardar productos en el archivo:", err);
        }
    }

    createFileIfNotExists() {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]', 'utf8');
                console.log("Archivo 'products.json' creado.");
            }
        } catch (err) {
            console.error("Error al crear el archivo 'products.json':", err);
        }
    }

}

// Proceso de testing
const manager = new ProductManager('productos.json');

console.log("Al crear la instancia, getProducts devuelve:", manager.getProducts());

manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

manager.addProduct("Tarjeta grafica", "Tarjeta grafica 8gb", 350, "Sin imagen", "abc124", 10,)

console.log("Después de agregar un producto, getProducts devuelve:", manager.getProducts());

manager.getProductById(1);

manager.updateProduct(1, { price: 250 });

manager.deleteProduct(1);

