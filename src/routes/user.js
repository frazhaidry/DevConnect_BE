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

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        console.log('Fetching connections...');
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                 { toUserId: loggedInUser._id, status: "accepted" },
                 { fromUserId: loggedInUser._id, status: "accepted" }
             ]
        })
        .populate("fromUserId", ["firstName", "lastName"])
        .populate("toUserId", ["firstName", "lastName"]);

        console.log('Fetched connection requests:', connectionRequest);

        console.log(connectionRequest);

        const data = connectionRequest.map((row) => {

            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        }
    ); 
 
        res.json({ data });

    }
    catch(error){
        res.status(400).send({message: error.message});
    }
})
module.exports = userRouter