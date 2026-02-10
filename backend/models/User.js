const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "SALES_OFFICER"]
    },

    region: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);
