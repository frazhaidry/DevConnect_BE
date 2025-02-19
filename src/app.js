const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
require('dotenv').config();

require("./utils/cron")

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,  
}))
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// API - Delete the existing user from the database
app.delete("/user", async(req, res) => {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete({ _id: userId})

        res.send("User deleted successfully")

    }catch(err){
        res.status(400).send("Something went wrong");
    }
}
) 

// API - To update the existing user
app.patch("/user/:userId", async(req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

 
    try {
        const  ALLOWED_UPDATE = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
    
        const isUpdateAllowed = Object.keys(data).every(k => 
            ALLOWED_UPDATE.includes(k) 
        )
    
        if(!isUpdateAllowed){
           throw new Error("Update not Allowed")  
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10") 
        }

        const user = await User.findByIdAndUpdate({_id: userId}, data , {
            returnDocument: "before",
            returnDocument: "after",
            runValidators: true,
        });  

        console.log(user)
        res.send("User updated successfullly");

    } catch (err) {

        res.status(400).send("User not updated " + err.message);
    }
})



async function startServer() {
    try {
        await connectDB();
        console.log("Database connection established...");
        
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port 3000`);
        });
    } catch (err) {
        console.log(err);
        console.error("Database cannot be connected");
    }
} 

startServer();

