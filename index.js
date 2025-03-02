const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const authRoute = require ('./Routes/auth.js');
const userRoute = require ('./Routes/user.js');
const doctorRoute = require ('./Routes/doctor.js');

const corsOptions = {
    origin: true,
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);

// MongoBD Connection
mongoose.set('strictQuery', false)
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB database is connected");
    } catch (error) {
        console.log("MongoDB database is failed to connect");
    }
}

// Server Running API
app.get('/', (req, res) => {
    res.send("CurePoint server is running")
})
app.listen(port, () => {
    connectDB();
    console.log(`This server is running on port: ${port}`);
})