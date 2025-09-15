const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Normalize
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password.trim() : "";

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Check if already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Debug before create
    console.log("→ Creating user with:", { name, email, hashedPassword, role });

    // Create user
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role: role || "User"
    });

    console.log("→ User created:", user.toJSON());

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pwd, ...userData } = user.toJSON();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData
    });
  } catch (err) {
    console.error("Register error full:", err);
    return res.status(500).json({ success: false, message: "Error registering user", error: err.message });
  }
};


// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isValid = await bcrypt.compare(normalizedPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pwd, ...userData } = user.toJSON();

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: userData
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Error logging in" });
  }
};
