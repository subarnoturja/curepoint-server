const User = require ('../models/UserSchema')

const updateUser = async(req, res) => {
    const id = req.params.id;
    try {
        const updateUser = await User.findByIdAndUpdate(id, {$set: req.body}, {new: true})
        res.status(200).json({success: true, message: "Successfully Updated", data:updateUser})
    } catch (error) {
        res.status(500).json({success: false, message: "Failed To Updated", data:updateUser})
    }
}

const deleteUser = async(req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({success: true, message: "Successfully Deleted"})
    } catch (error) {
        res.status(500).json({success: false, message: "Failed To Delete"})
    }
}

const getSingleUser = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("-password")
        res.status(200).json({success: true, message: "User Found", data:user})
    } catch (error) {
        res.status(404).json({success: false, message: "User Not Found"})
    }
}

const getAllUser = async(req, res) => {
    try {
        const users = await User.find({}).select("-password")
        res.status(200).json({success: true, message: "Users Found", data:users})
    } catch (error) {
        res.status(404).json({success: false, message: "Users Not Found"})
    }
}

module.exports = { updateUser, deleteUser, getAllUser, getSingleUser };