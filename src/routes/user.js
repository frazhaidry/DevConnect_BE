const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const userRouter = express.Router();
const User = require("../models/user")

 const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

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

// Get all the connection that the loggedin user have
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


// Get feed API 
userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        // User should not see all the user cards except
        // 0. his own card
        // 1. his connection
        // 2. ignored people
        // 3. already sent the connection request

        const loggedInUser =  req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;

        const skip = (page-1) * limit

        //Find all connection request(sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }) 
        .select("fromUserId toUserId")
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName")


        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
     
        // console.log(hideUsersFromFeed);
    
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed)}},
                { _id: { $ne: loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        
        res.json({data : users}); 

    }
    catch(err){
        res.status(400).json({message : err.message})
    }
}) 

module.exports = userRouter 