const mongoose = require("mongoose");


//creating a schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 40,
    },

    lastName: { 
        type: String,
    },

    emailId: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 18,
        max: 50,
    },

    gender: {
        type: String,
        validate(value){ // Custom validate function
           if(!["male", "female", "others"].includes(value)){
             throw new Error("Gender data is not valid")
           }
        }
    },

    photoUrl: {
        type: String,
        default: "https://www.inklar.com/wp-content/uploads/2020/05/dummy_user-370x300-1.png"
    },

    about: {
        type: String,
        default: "This is a default about of the user!"
    },

    skills: {
        type: [String]
    }
}, {
    timestamps: true,
});


//creating a model -> now we make a instance
module.exports = mongoose.model("User", userSchema)

