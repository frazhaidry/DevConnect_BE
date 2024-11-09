const adminAuth = (req, res, next) => {
    console.log("admin auth is being handle")
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized User");
    }
    else{
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("User auth is getting handle")
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized User");
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}