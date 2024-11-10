const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json());

app.post("/signup", async (req, res) => {

    console.log(req.body);
    const user = new User(req.body);
    
    try { 
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("An error occurred while adding the user.");
    }
});


async function startServer() {
    try {
        await connectDB();
        console.log("Database connection established...");
        
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.log(err);
        console.error("Database cannot be connected");
    }
} 

startServer();

