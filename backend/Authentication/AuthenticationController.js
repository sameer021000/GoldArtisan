var AuthService = require("./AuthenticationService");

exports.isAuthenticated = function (req, res, next) {
    // Extract the Authorization header
    var token = req.get("Authorization");
    console.log("Token received:", token);

    if (token) {
        // Split the Authorization header to get the token part (removing 'Bearer' part)
        const tokenParts = token.split(' '); // This should give us an array ["Bearer", "<token>"]
        
        if (tokenParts.length === 2) {
            // Now tokenParts[1] is the actual token
            try {
                var result = AuthService.checkToken(tokenParts[1]); // Use only the token part
                next(); // Proceed to the next middleware or route handler
            } catch (e) {
                res.status(401).send(); // Token verification failed
            }
        } else {
            res.status(401).send(); // Invalid token format
        }
    } else {
        res.status(401).send(); // No token provided
    }
};