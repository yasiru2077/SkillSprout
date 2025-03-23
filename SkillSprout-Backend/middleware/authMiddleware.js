const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Access Denied. No token provided!" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token!" });
    }
};
