const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
const register = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      username,
      email,
      fullname,
      password: hashedPassword, //Secret123
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, 
      secure: false, 
      maxAge: 60 * 60 * 1000, 
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email/username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    })

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout
function logout(req, res) {
  const token = req.cookies.token
  if (!token) {
    return res.status(400).json({ message: "No token found" })
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,     // use true in production with HTTPS
    sameSite: "strict"
  })

  return res.status(200).json({ message: "Logged out successfully" })
}


module.exports = { register, login , logout };