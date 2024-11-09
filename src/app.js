const express = require("express");
// const { adminAuth, userAuth } = require("./middlewares/auth")
const app = express();

// When you handle err on the first line
// app.use("/", (err, req, res,next) => {
//     if(err){
//         res.status(500).send("Something went wrong");
//     }
// })


app.get("/getUserData",(req, res) => {
    try {
        throw new Error("hfgedege");
        res.send("User Data Sent");
    } catch (error) {
        res.status(500).send("Some error occured")
    }
   
})

// Handling all error
app.use("/", (err, req, res,next) => {
    if(err){
        res.status(500).send("Something went wrong");
    }
})

app.listen(3000, ()=> {
    console.log("Serving is running on 3000")
});