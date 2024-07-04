const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rafaelsantagata11:santg95@cluster0.fjz5sbs.mongodb.net/E-commerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Error al conectar DB"))