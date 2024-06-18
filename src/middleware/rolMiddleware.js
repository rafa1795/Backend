const rolMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        next();
    };
};

module.exports = rolMiddleware;
