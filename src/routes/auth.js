const express = require("express");
const { validateSignUpData } = require("../utils/validaton")
const User = require("../models/user")
const  bcrypt = require("bcrypt");



const authRouter = express.Router()


//API - To add user into a database
authRouter.post("/signup", async (req, res) => {
    try { 
    // Validation of data
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    // Encrypt the password 
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash)

    // Creating a new instance of the User Model
       console.log(req.body);
       const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
       });
 
    
        const savedUser = await user.save();

        const token = await user.getJWT();
            res.cookie("token", token , {
                expires: new Date(Date.now() + 8 * 3600000)
            });

        res.json({message: "User added successfully", data: savedUser});
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("ERROR : " + error.message);
    }
});

//API - login api 
authRouter.post("/login", async(req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId})
        // console.log(user); 
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){
            // Create a JWT Token
            const token = await user.getJWT();
            // console.log(token);


            // Add the token to cookie  and send the response back to the user
            res.cookie("token", token , {
                expires: new Date(Date.now() + 8 * 3600000)
            });  // Sending token which we get in profile url
            
            res.send(user);
            
        }
 
        else{
            throw new Error("Invalid Credentials pass");
        }


    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
}) 

authRouter.post("/logout", (req, res)=> {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout Successfully")
})

module.exports = authRouter;

