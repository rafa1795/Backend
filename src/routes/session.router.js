const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");

/*
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await UserModel.findOne({ email: email });
        if (usuario) {
            if (isValidPassword(password, usuario)) {
                req.session.login = true;
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    role: usuario.role
                };

                res.redirect("/");
            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})*/


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

//Con passport


router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) =>{
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    };

    req.session.login = true;
    res.redirect("/profile")
})

router.get("/faillogin", async (req, res) => {
    res.send("Fallo");
})

//Para GitHub

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async(req, res) => {

})

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

module.exports = router; 