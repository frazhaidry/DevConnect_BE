const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json());

//API - To add user into a database
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

//API - Get user by email;
app.get("/user",async (req, res) => {
    const userEmail = req.body.emailId; 
    try{
       const users = await User.findOne({emailId: userEmail}); 
       if(!users){
         res.status(404).send("User not found");
        
       }else{
         res.send(users)
       }
    }catch(err){ 
        res.status(400).send("Someting went wrong");
    }
})

// Feed API - GET/feed - get all the users from the database
app.get("/feed", async(req, res) => { 
    try {
        const users = await User.find({})
        res.send(users);

        
    } catch (error) {
        res.status(400).send("Someting went wrong");
    }
})

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
        
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.log(err);
        console.error("Database cannot be connected");
    }
} 

startServer();

