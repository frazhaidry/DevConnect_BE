const express = require("express");

const app = express();

//we can
//app.use("/route", [rH, rh2, rh3, rh4, rh5]);

app.use(
    "/user", [
(req, res, next) => {
    //Route Handler
    console.log("Handling the route user 1")
    // res.send("Route Handler 1");
    next();
},

(req,res,next) => {
    console.log("Handling the route user 2")
    // res.send("Route handler 2");
    next();
}
],

(req,res,next) => {
    console.log("Handling the route user 3")
    // res.send("Route handler 2");
    next();
},

(req,res,next) => {
    console.log("Handling the route user 4")
    res.send("Route handler 4");
    // next()
}
);
app.listen(3000, ()=> {
    console.log("Serving is running on 3000")
});