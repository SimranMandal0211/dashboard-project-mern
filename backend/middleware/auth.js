const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.replce("Bearer ","").trim();


    if(!token){
        return res.status(401).json({
            message: "No token, authorization denied"
        });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        return res.status(401).json({
            message: "Token is not valid"
        });
    }
};