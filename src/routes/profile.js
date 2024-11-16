const express = require("express");
const { userAuth } = require("../middlewares/auth")

const profileRouter = express.Router();

//API - Profile API
profileRouter.get("/profile", userAuth, async(req, res) => {
    try { 
   
     const user = req.user
    
     res.send(user);
  
  //    console.log(cookies);
  //    res.send("Reading Cookie");
      
    }catch (error) {
      res.status(400).send("Error : " + error.message);
  } 
  })

  module.exports = profileRouter
