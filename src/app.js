const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateSignUpData } = require("./utils/validaton")
const  bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json());
app.use(cookieParser())

//API - To add user into a database
app.post("/signup", async (req, res) => {
    try { 
    // Validation of data
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    // Encrypt the password 
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash)

    // Creating a new instance of the User Model
       console.log(req.body);
       const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
       });

    
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        // console.error("Error adding user:", error);
        res.status(500).send("ERROR : " + error.message);
    }
});

//API - login api 
app.post("/login", async(req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId})

        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid){
            // Create a JWT Token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$711");
            // console.log(token);


            // Add the token to cookie  and send the response back to the user
            res.cookie("token", token);
            res.send("Login Successful!");
        }

        else{
            throw new Error("Invalid Credentials");
        }


    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
}) 

//API - Profile API
app.get("/profile", async(req, res) => {
  try { 
    const cookies =  req.cookies;

   const { token } = cookies;

   if(!token){
     throw new Error("Invalid Token")
   }

   // Validate my token 

   const decodedMessage = await jwt.verify(token, "DEV@Tinder$711")
   
//    console.log(decodedMessage); 

   const {_id} = decodedMessage; // id is destructred from decodedMessage

//    console.log("Logged In user is: " + _id);

   const user = await User.findById(_id);

   if(!user){
    throw new Error("User does not exist");
   }

   res.send(user);

//    console.log(cookies);
//    res.send("Reading Cookie");
    
  }catch (error) {
    res.status(400).send("Error : " + error.message);
} 
})

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
        res.status(400).send("Error : " + err.message);
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

