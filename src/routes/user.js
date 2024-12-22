const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const userRouter = express.Router();

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggendInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggendInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName","lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })
    }
    catch(err){
        req.statusCode(400).send("ERROR: " + err.message);
    }
})


module.exports = userRouter