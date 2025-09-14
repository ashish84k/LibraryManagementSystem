const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  
  try {
    const user = await User.findOne({ where: { email } });
    console.log("hiii",user ,email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const { password: pwd, ...userData } = user.toJSON();

    res.json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};
