
const PUERTO = 8080;
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

let products = []; 

function loadProductsFromFile() {
    try {
        const filePath = path.join(__dirname, '..', 'products.json'); 
        const data = fs.readFileSync(filePath, 'utf8');
        products = JSON.parse(data);
        
    } catch (err) {
        
    }
}

loadProductsFromFile(); 

app.get("/", (req, res) => {
    res.send("Inicio")
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

app.get("/productos", async (req, res) => {
    res.send(products);
});

app.get("/productos/:id", async (req, res) => {
    let id = req.params.id;

    const producto = products.find(producto => producto.id == id);

    if (producto) {
        res.send(producto);
    } else {
        res.send("Producto no encontrado");
    }
});

app.get("/producto", async (req, res) => {
    let limit = parseInt(req.query.limit);

    let productos = products.slice(0, limit);
    res.send(productos);
}); 