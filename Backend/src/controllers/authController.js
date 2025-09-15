const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Normalize inputs
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password.trim() : "";

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET, // must be set in Render / .env
      { expiresIn: "7d" }
    );

    // Remove password from user object
    const { password: pwd, ...userData } = user.toJSON();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  try {
    let { email = "", password = "" } = req.body;

    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password.trim() : "";

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password are required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Get stored hash
    const storedHash = user.password || user.dataValues?.password;
    if (!storedHash) {
      return res.status(500).json({ success: false, message: "User password not found" });
    }

    // Compare passwords (async)
    const isValid = await bcrypt.compare(password, storedHash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET, // must be set
      { expiresIn: "7d" }
    );

    const { password: pwd, ...userData } = user.toJSON();

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Error logging in", error: err.message });
  }
};
