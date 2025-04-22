const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const requestRouter = express.Router();

const sendEmail = require("../utils/sendEmail")

//API - To send connection req
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
      const fromUserId = req.user._id; // Get the ID of the logged-in user
      const toUserId = req.params.toUserId; // Get the ID of the user to send the request to
      const status = req.params.status; // Get the status (ignored or interested)
      
      // Fetch the 'from' user data from the database using the user ID
      const fromUser = await User.findById(fromUserId);
      
      if (!fromUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch the 'to' user data from the database using the toUserId
      const toUser = await User.findById(toUserId);
  
      if (!toUser) {
        return res.status(404).json({ message: "User to send request to not found" });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type: " + status });
      }
  
      // Check if an existing connection request already exists between these two users
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
  
      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Connection Request Already Exists!" });
      }
  
      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
  
      const data = await connectionRequest.save(); // Save the connection request
  
      // Send an email notification (assuming sendEmail is a helper function or service you have)
      const emailRes = await sendEmail.run(
        "A new friend request from " + fromUser.firstName,
        fromUser.firstName + " is " + status + " in " + toUser.firstName
      );
  
      console.log(emailRes);
  
      // Create a message based on the status
      const message =
        status === "interested"
          ? `${fromUser.firstName} is interested in connecting with ${toUser.firstName}`
          : `${fromUser.firstName} has ignored ${toUser.firstName}'s connection request`;
  
      // Return the success response
      res.json({
        success: true,
        message,
        data,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).send("ERROR: " + err.message);
    }
  });
  

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;

        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"]; 
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Status not allowed!"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            res.status(400).json({message: "Connection request not found"});
        }

        connectionRequest.status = status;   

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data})

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    } 
    
   
} )

module.exports = requestRouter 