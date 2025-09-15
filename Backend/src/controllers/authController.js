const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Check if user already exists
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "User",
    });

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable not set");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Exclude password from response
    const { password: pwd, ...userData } = user.toJSON();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData,
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: err.message,
    });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password required" });
    }

    // Normalize
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Find user by email
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isValid = await bcrypt.compare(normalizedPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable not set");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Exclude password
    const { password: pwd, ...userData } = user.toJSON();

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userData,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};
