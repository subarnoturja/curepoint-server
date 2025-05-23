const jwt = require ('jsonwebtoken') 
const Doctor = require("../models/DoctorSchema");
const User = require("../models/UserSchema");

const authenticate = async(req, res, next) => {
    // get token from headers
    const authToken = req.headers.authorization

    // check token is exists
    if(!authToken || !authToken.startsWith('Bearer ')){
        return res.status(401).json({ success: false, message: "No token, authorization denied" })
    }

    try {
        const token = authToken.split(' ')[1];
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        req.role = decoded.role

        next(); // must be call the next function
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({ message: "Token is expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
}

const restrict = roles => async(req, res, next) => {
    const userId = req.userId;
    let user;

    try {
        const patient = await User.findById(userId)
        const doctor = await Doctor.findById(userId)

    if(patient) {
        user = patient
    }

    if(doctor) {
        user = doctor
    }

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if(!roles.includes(user.role)){
        return res.status(403).json({ success: false, message: "You are not authorized" })
    }

    next();
    } catch (error) {
        console.error("Restrict middleware error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}

module.exports = { authenticate, restrict };