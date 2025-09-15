const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    
    await User.create({ name, email, password, role: role || "User" });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err); 
    res.status(500).json({ message: "Error registering user" });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password required" });
    }

    // Normalize
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Find user by email
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isValid = await bcrypt.compare(normalizedPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Exclude password
    const { password: pwd, ...userData } = user.toJSON();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userData,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Error logging in"
    });
  }
};
