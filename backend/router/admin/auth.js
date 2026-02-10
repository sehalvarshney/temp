const express = require('express');
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const sendWhatsApp = require("../../utils/twilio");

const router = express.Router();

router.get("/check", async (req, res) => {
    res.send("Working... Hello, I am Sehal's backend 🚀");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, role , region , password } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password should be at least 6 characters"
      });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create & save user
    const user = new User({
      name,
      email,
      phone,
      role , 
      region ,
      password: hashedPassword
    });

    await user.save();

    // 5. Send WhatsApp notification
    await sendWhatsApp(
      phone,
      `Hello ${name} 👋\nYour account has been created successfully.`
    );

    // 6. Success response
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


router.get("/userprofile", async (req, res) => {
  try {
    const { email } = req.query; // ✅ use query for GET

    const userprofile = await User.findOne({ email }).select("-password");

    if (!userprofile) {
      return res.status(404).json({
        error: "User does not exist"
      });
    }

    res.status(200).json({
      user: userprofile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error in fetching user"
    });
  }
});



module.exports = router;