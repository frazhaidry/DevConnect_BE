const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async(req, res, next) => {
    // Read the token from the req cookies
    try {
        const cookies = req.cookies;


        const {token} = cookies;
        if(!token){
            throw new Error("Token is not valid!!!!")
        }
    
        const decodedObj = await jwt.verify(token, "DEV@Tinder$711")
    
        const {_id} = decodedObj;
    
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
        
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }

}

module.exports = {
  
    userAuth
}