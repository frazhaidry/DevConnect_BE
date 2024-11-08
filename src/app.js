const express = require("express");

const app = express();


app.post("/hello", (req, res) => {
    res.send("Post call");
});

app.delete("/hello", (req, res) => {
    res.send("Deleted successfully");
});

//Dynamic Routing (hello/123/fraz)
app.get("/hello/:id/:name", (req, res) => {
    console.log(req.params)
    res.send({ firstName : "fraz", lastName: "Haidry"})
});


//To get the query send hello?userid=101&pass=123 in the postman get method
app.get("/hello", (req, res) => {
    console.log(req.query)
    
});



app.listen(3000, ()=> {
    console.log("Serving is running on 3000")
});