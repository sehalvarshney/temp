const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get("/check", async (req, res) => {
    res.send("Working... Hello, I am Sehal's backend 🚀");
});

router.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // password validation
        if (password.length < 6 ){
            return res.status(400).json({
                error: "Password should be of length at least 6"
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already registered"
            });
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // 5. Success Response
        res.status(201).json({
            message: "User registered successfully ✅"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error in registration"
        });
    }
});

router.post("/login", async (req, res) => {

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


module.exports = router;