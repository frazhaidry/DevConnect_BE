const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth")
const app = express();

app.use("/admin", adminAuth);
// app.use("/user", userAuth);

//Authorized route
app.get("/admin/getdata", (req,res) => {
    res.send("All data sent");
    
})
 
//Authorized route
app.get("/admin/deletedata", (req, res)=> {
    res.send("Deleted a user");
})

//This route will not need to be authenticated 
app.post("/user/login", (req, res) => {
    res.send("User logged in successfully");
})

//This route will check user is authorized or not
app.get("/user/data", userAuth, (req, res) => {
    res.send("All Data Sent");
})

app.listen(3000, ()=> {
    console.log("Serving is running on 3000")
});