const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


const loginRouter = express.Router();


loginRouter.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // 2. Find User
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                error: "User not found. Please register first."
            });
        }

        // 3. Compare Password
        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid password"
            });
        }

        // 4. Success
        res.status(200).json({
            message: "Login successful ✅",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Login failed"
        });
    }
});

module.exports = loginRouter ;  
