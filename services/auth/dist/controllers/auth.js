import jwt from "jsonwebtoken";
import User from "../model/User.js";
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || "default_jwt_secret_dev_key";
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    return jwt.sign(payload, secret, { expiresIn });
};
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide username, email, and password",
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
            return;
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
            return;
        }
        const user = new User({
            username,
            email: email.toLowerCase(),
            password,
            role: role || "customer",
        });
        await user.save();
        const userPayload = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        };
        const token = generateToken(userPayload);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: userPayload,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error while registering user",
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
            return;
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const userPayload = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        };
        const token = generateToken(userPayload);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userPayload,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error while logging in",
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching profile",
        });
    }
};
export const verifyToken = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};
