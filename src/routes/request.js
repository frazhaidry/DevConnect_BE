const express = require("express");
const { userAuth } = require("../middlewares/auth")

const requestRouter = express.Router();

//API - To send connection req
requestRouter.post("/sendConnectionRequest", userAuth, async(req, res) => {
    // Sending a connection request
    const user = req.user;
    console.log("Sending a connection request");
  
    res.send(user.firstName + " has Sent the connection Request");
     
  })
 
module.exports = requestRouter