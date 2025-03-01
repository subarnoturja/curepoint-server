const User = require ('../models/UserSchema')
const Doctor= require ('../models/DoctorSchema') 
const jwt = require ('jsonwebtoken') 
const bcrypt = require ('bcryptjs')

// Register
const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try {
        let user = null;
        if(role === 'patient'){
            user = await User.findOne({ email })
        }
        else if(role === 'doctor'){
            user = await Doctor.findOne({ email })
        }

        // Check if user exist
        if(user) {
            return res.status(400).json({ message: "user already exist" })
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        if(role === 'patient'){
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        else if(role === 'doctor'){
            user = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()
        res.status(200).json({ success: true, message: "User Successfully Created" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// Login 
const login = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { register, login };