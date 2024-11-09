const mongoose = require("mongoose");


//creating a schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type:String
    },
    emailId: {
        type:String
    },
    password: {
        type:String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
});


//creating a model -> now we make a instance
module.exports = mongoose.model("User", userSchema)

