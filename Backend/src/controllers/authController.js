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

exports.login = async (req, res) => {
  const { email = "", password = "" } = req.body; // defaults to avoid undefined

  try {
    console.log("→ Login attempt for:", email);

    const user = await User.findOne({ where: { email } });
    console.log("→ user found (raw):", !!user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials (no user)" });
    }

    // Log stored hash and incoming password (DEBUG ONLY) — remove later!
    const storedHash = user.password || user.dataValues?.password;
    console.log("→ incoming password (raw):", JSON.stringify(password));
    console.log("→ stored hash:", storedHash);

    // 1) Trim incoming password (common issue)
    const normalizedPassword = password.trim();
    if (normalizedPassword !== password) {
      console.log("→ note: password trimmed", { before: password.length, after: normalizedPassword.length });
    }

    // 2) Try async compare
    const validAsync = await bcrypt.compare(normalizedPassword, storedHash);
    console.log("→ bcrypt.compare async result:", validAsync);

    // 3) Try sync compare as a fallback test
    const validSync = bcrypt.compareSync(normalizedPassword, storedHash);
    console.log("→ bcrypt.compareSync result:", validSync);

    if (!validAsync && !validSync) {
      // Helpful hints in response (do not leak hashes in production)
      console.log("→ Passwords did not match. Possible causes: wrong password, whitespace, different hash algorithm.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "1h" }
    );

    const { password: pwd, ...userData } = user.toJSON ? user.toJSON() : { ...user };
    res.json({ success: true, message: "Logged in successfully.", token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
