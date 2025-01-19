const validator = require("validator")

const validateSignUpData  = (req) => {
    const { firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!")
    }

    else if(!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
   }

    else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not Strong")
   }
}

// Validation function for editing profile or password
const validateEditProfileOrPasswordData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
        "password" // Include 'password' field for password updates
    ];

    // Ensure all fields in the request body are allowed
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};

module.exports  = {
    validateSignUpData,
    validateEditProfileOrPasswordData,
}