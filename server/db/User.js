import mongoose from "mongoose";
//const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// module.exports = mongoose.model('User', UserSchema);

const User = mongoose.model('User', UserSchema);

export default User;