const express = require("express");
const app = express();
const session = require("express-session");
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");
const rolMiddleware = require("./middleware/rolMiddleware.js");
require("./database.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// Sesión y Passport
app.use(session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Configurar Handlebars
app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Rutas protegidas por roles
app.get("/chat", isAuthenticated, rolMiddleware(["user"]), (req, res) => {
    res.render("chat", { user: req.user });
});
app.get("/realtimeproducts", isAuthenticated, rolMiddleware(["admin"]), (req, res) => {
    res.render("realtimeproducts", { user: req.user });
});

// Ruta del perfil del usuario
app.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile", { user: req.user });
});

// Ruta de login
app.get("/login", (req, res) => {
    res.render("login");
});

// Ruta de logout
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});

// Rutas de autenticación
app.post("/login", passport.authenticate("login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
}));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

// Iniciar el servidor
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
});

// Configuración de Socket.io
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
        io.sockets.emit("productos", await productManager.getProducts());
    });
});
