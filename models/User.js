const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password required"]
    }
}, { timestemps: true });


module.exports = mongoose.model("User", userSchema);