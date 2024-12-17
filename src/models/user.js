const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


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
        validate(value){
            if(!validator.isEmail(value)){ 
                throw new Error("Invalid  email Address: " + value);
            }
        } 
    },

    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){ 
                throw new Error("Enter a Strong Password: " + value);
            }
        } 
    },  

    age: {
        type: Number,
        min: 18,
        max: 50,
    },

    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid geder type`,
        },
        
        // validate(value){ // Custom validate function
        //    if(!["male", "female", "others"].includes(value)){
        //      throw new Error("Gender data is not valid")
        //    }
        // }
    },

    photoUrl: {
        type: String,
        default: "https://www.inklar.com/wp-content/uploads/2020/05/dummy_user-370x300-1.png",
        validate(value){
            if(!validator.isURL(value)){ 
                throw new Error("Invalid  Photo URL " + value);
            }
        } 
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


userSchema.methods.getJWT = async function () {
    const user = this; // this refer to the current user which sign in // note it will work with only normal function

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$711", {expiresIn: "1d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwrodInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwrodInputByUser, passwordHash);
    return isPasswordValid
}

//creating a model -> now we make a instance
module.exports = mongoose.model("User", userSchema)

