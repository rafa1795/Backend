const mongoose = require("mongoose");
const configObject = require("./config/config.js");



mongoose.connect(configObject.mongo_url)
    .then(() => console.log("Conexion exitosa"))
    .catch((error) => console.log("Error en conexion", error))
    