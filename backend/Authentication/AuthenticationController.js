// AuthenticationController.js (replace existing isAuthenticated)
var AuthService = require("./AuthenticationService");

exports.isAuthenticated = function (req, res, next) {
  try {
    const authHeader = req.get("Authorization") || req.headers.authorization;
    if (!authHeader || typeof authHeader !== "string") {
      return res.status(401).json({ success: false, message: "Missing Authorization header" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({ success: false, message: "Invalid Authorization format" });
    }

    const token = parts[1];
    // verify token and get payload (this will throw if token invalid/expired)
    const payload = AuthService.checkToken(token);

    // attach user payload to request for downstream handlers
    req.user = payload;
    // optionally attach the raw token if you need it elsewhere:
    // req.token = token;

    return next();
  } catch (err) {
    // handle JWT errors gracefully
    console.warn("Auth failed:", err.message || err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
