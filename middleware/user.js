const jwt = require('jsonwebtoken');
const {jwtUserSecret} = require("../config");

function userMiddleware(req,res,next){
    try{
        const token = req.cookies.userToken;
        if(!token){
            return res.status(401).json({message:" Unauthorized: No token provided"});
        }
        const decoded = jwt.verify(token, jwtUserSecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        console.error("Error in user middleware: ", error);
        return res.status(401).json({message:"Unauthorized: Invalid token"});
    }
}

module.exports = { userMiddleware };