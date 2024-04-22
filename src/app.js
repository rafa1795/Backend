    const express = require("express");
    const app = express(); 
    const PUERTO = 8080;
    const exphbs = require("express-handlebars");
    const socket = require("socket.io");
    const productsRouter = require("./routes/products.router.js");
    const cartsRouter = require("./routes/carts.router.js");
    const viewsRouter = require("./routes/views.router.js");
    require("./database.js");

    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static('./src/public'));


    app.engine("handlebars", exphbs.engine());
    app.set("view engine", "handlebars");
    app.set("views", "./src/views");

    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/", viewsRouter);


    const httpServer = app.listen(PUERTO, () => {
        console.log(`Escuchando en el puerto: ${PUERTO}`);
    })

    const MessageModel = require("./models/message.model.js");
    const io = new socket.Server(httpServer);

    const ProductManager = require("./controllers/productManagerDB.js");
    const productManager = new ProductManager();

    io.on("connection", async (socket) => {
        console.log("Nuevo usuario conectado");
    
        socket.on("message", async data => {
            await MessageModel.create(data);
            const messages = await MessageModel.find();
            console.log(messages);
            io.sockets.emit("message", messages);
        });
    
        socket.emit("productos", await productManager.getProducts());
    
        socket.on("eliminarProducto", async (id) => {
            await productManager.deleteProduct(id);
            socket.emit("productos", await productManager.getProducts());
        });
    
        socket.on("agregarProducto", async (producto) => {
            await productManager.addProduct(producto);
            io.socket.emit("productos", await productManager.getProducts());
        });
    });