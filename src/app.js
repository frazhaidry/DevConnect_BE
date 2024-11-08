const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from the Dashboard")
})

app.get("/test", (req, res) => {
    res.send("Hello from the test path");
})

app.listen(3000, ()=> {
    console.log("Serving is running on 3000")
})