const jwt = require('jsonwebtoken');
const {jwtAdminSecret} = require("../config");

function adminMiddleware(req,res,next){
    try{
        const token = req.cookies.adminToken;
        if(!token){
            return res.status(401).json({message:" Unauthorized: No token provided"});
        }
        const decoded = jwt.verify(token, jwtAdminSecret);
        req.adminId = decoded.adminId;
        next();
    }
    catch(error){
        console.error("Error in admin middleware: ", error);
        return res.status(401).json({message:"Unauthorized: Invalid token"});
    }
}

module.exports = {adminMiddleware};