const mongoose = require("mongoose");



mongoose.connect("mongodb+srv://rafaelsantagata11:santg95@cluster0.fjz5sbs.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion exitosa"))
    .catch((error) => console.log("Error al conexion", error))
    