const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile", authMiddleware, userController.profile);
router.post("/logout", authMiddleware, userController.logout);

module.exports = router;






