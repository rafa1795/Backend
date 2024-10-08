const UserModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const CartModel = require("../models/cart.model");
const { EmailManager } = require('../services/email');

class UserController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email }).populate('cart');

            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.json({
                message: "Login exitoso",
                cartId: usuarioEncontrado.cart._id,
                redirectUrl: "/api/users/profile"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }
    
            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();
    
            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id,
                password: createHash(password),
                age
            });
    
            await nuevoUsuario.save();
    
            const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
                expiresIn: "1h"
            });
    
            res.cookie("coderCookieToken", token, {
                maxAge: 4000000,
                httpOnly: true
            });
    
            // Redirigir directamente al perfil del usuario con el cartId en la URL
            res.redirect(`/api/users/profile?cartId=${nuevoCarrito._id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }
    

    async profile(req, res) {
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }

    async obtenerUsuarios(req, res) {
        try {
            const usuarios = await UserModel.find({}, 'first_name email role');
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    async renderUsuarios(req, res) {
        try {
            const usuarios = await UserModel.find({}, 'first_name email role');
            res.render('usuarios', { usuarios, isAdmin: req.user.role === 'admin' });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }
    
    async cambiarRol(req, res) {
        try {
            const { id } = req.params;
            const { newRole } = req.body;
            await UserModel.findByIdAndUpdate(id, { role: newRole });
            res.redirect('/api/users');
        } catch (error) {
            res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
        }
    }

}

module.exports = UserController;











