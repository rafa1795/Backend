const mongoose = require("mongoose");
const configObject = require("./config/config.js");



class BaseDatos {
    static #instancia; 
    constructor(){
        mongoose.connect("mongodb+srv://rafaelsantagata11:santg95@cluster0.fjz5sbs.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0");
    }

    static getInstancia() {
        if(this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia;
        }

        this.#instancia = new BaseDatos(); 
        console.log("Conexion exitosa");
        return this.#instancia;
    }
}

module.exports = BaseDatos.getInstancia();