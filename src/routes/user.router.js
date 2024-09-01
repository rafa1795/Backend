const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile", authMiddleware, userController.profile);
router.post("/logout", authMiddleware, userController.logout);
router.get('/', userController.obtenerUsuarios.bind(userController));
router.get('/usuarios', authMiddleware, userController.renderUsuarios.bind(userController));
router.post('/usuarios/cambiar-rol/:id', authMiddleware, userController.cambiarRol.bind(userController));


module.exports = router;






