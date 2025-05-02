const User = require ('../models/UserSchema')
const Doctor= require ('../models/DoctorSchema') 
const jwt = require ('jsonwebtoken') 
const bcrypt = require ('bcryptjs')

const generateToken = user => {
    return jwt.sign(
        { id:user._id, role: user.role }, 
        process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

// Register
const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try {
        let user = null;
        // Check if user exist
        if(role === 'patient'){
            user = await User.findOne({ email })
        }
        else if(role === 'doctor'){
            user = await Doctor.findOne({ email })
        }

        if(user) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        if(role === 'patient'){
            user = new User({
                name,
                email,
                password: hashedPassword,
                photo,
                gender,
                role
            })
        }

        else if(role === 'doctor'){
            user = new Doctor({
                name,
                email,
                password: hashedPassword,
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
    const { email, password } = req.body;
    try {
        let user = null;
        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });

        if (patient) {
            user = patient;
        } else if (doctor) {
            user = doctor;
        }

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        // compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({ status: false, message: "Invalid credentials"});
        }
        // get token
        const token = generateToken(user)
        const {password: pwd, role, appointment, ...rest} = user.toObject();
        res.status(200).json({ status: true, message: "Successfully Logged In", token, data: {...rest}, role: user.role });
    } catch (error) {
        console.error("Login error:", error); 
        res.status(500).json({ status: false, message: "Failed to Login"});
    }
}

module.exports = { register, login };