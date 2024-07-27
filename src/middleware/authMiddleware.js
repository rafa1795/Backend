const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.cookies.coderCookieToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, "coderhouse", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded.user;
        next();
    });
}

module.exports = authMiddleware;






