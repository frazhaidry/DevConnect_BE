const express = require("express");
const  bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileOrPasswordData } = require("../utils/validaton");


const profileRouter = express.Router();

//API - Profile API
profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try { 
   
     const user = req.user
    
     res.send(user);
  
  //    console.log(cookies);
  //    res.send("Reading Cookie");
      
    }catch (error) {
      res.status(400).send("Error : " + error.message);
  } 
  })

// Profile and Password Edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileOrPasswordData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        // console.log(loggedInUser); // Before updation

        // Check if password is being updated
        if (req.body.password) {
            // Validate password length or strength if necessary
            if (req.body.password.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }

            // Hash the new password before saving
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update user profile fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        // console.log(loggedInUser); // After updation

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

  profileRouter.patch("/profile/password", userAuth, async(req, res)=> {
    
  })

  module.exports = profileRouter
