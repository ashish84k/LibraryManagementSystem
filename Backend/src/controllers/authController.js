const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email = "", password = "" } = req.body;

  try {
    console.log("→ Login attempt for:", email);

    const user = await User.findOne({ where: { email } });
    console.log("→ user found (raw):", !!user);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials (no user)" });
    }

    const storedHash = user.password || user.dataValues?.password;
    console.log("→ incoming password:", password);
    console.log("→ stored hash:", storedHash);

    const normalizedPassword = password.trim();
    const valid = await bcrypt.compare(normalizedPassword, storedHash);

    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ JWT create
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "7d" } // 7 days validity
    );

    const { password: pwd, ...userData } = user.toJSON ? user.toJSON() : { ...user };

    // ✅ Response me token + user bhejna (cookie nahi)
    res.json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Error logging in", error: err.message });
  }
};

