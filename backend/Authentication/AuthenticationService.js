const JWT = require("jsonwebtoken");

exports.createToken = (data) => {
    console.log("here we will create token");
    var mysecretkey = "goldartisansecretkey";
    try {
        var token = JWT.sign(data, mysecretkey);
        return token;
    } catch (e) {
        console.log("Error in signing data", e);
        throw e;
    }
}

exports.checkToken = function (token) {
    var mysecretkey = "goldartisansecretkey";
    try {
        var result = JWT.verify(token, mysecretkey);
        return result;
    } catch (e) {
        console.log("error in checking for token", e);
        throw e;
    }
}
