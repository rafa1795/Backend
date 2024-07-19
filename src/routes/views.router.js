const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

router.get("/products", 
    passport.authenticate('jwt', { session: false }), 
    checkUserRole(['usuario']), 
    viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", 
    passport.authenticate('jwt', { session: false }), 
    checkUserRole(['admin']), 
    viewsController.renderRealTimeProducts);

router.get("/chat", 
    passport.authenticate('jwt', { session: false }), 
    checkUserRole(['usuario']), 
    viewsController.renderChat);

router.get("/", viewsController.renderHome);

module.exports = router;
