const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

// Login con Passport
router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales inválidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };

    res.redirect("/profile");
});

router.get("/faillogin", async (req, res) => {
    res.send("Fallo en el inicio de sesión");
});

// Para GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/profile");
});

module.exports = router;