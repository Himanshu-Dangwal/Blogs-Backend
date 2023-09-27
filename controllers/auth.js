const crypto = require('crypto')
const secretKey = "HimanshuDangwal"
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');



module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body
    const user = new User({ username, email, password })
    const resp = await user.save()
    const data = {
        user: { id: user._id }
    }
    // console.log(process.env.SECRET);
    const authToken = jwt.sign(data, secretKey)
    res.status(201).json({ success: true, user: resp, authToken })
}

module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        const data = {
            user: { id: foundUser._id }
        }
        const authToken = jwt.sign(data, secretKey)
        res.status(201).json({ success: true, authToken })
    } else {
        res.status(400).json({message : "Invalid credentials"})
    }
}

module.exports.getUser = async (req, res) => {
    const userId = req.user.id
    console.log(userId);
    const user = await User.findById(userId).select("-password")
    console.log(user);
    res.status(201).json(user)
}

module.exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404).json({message : "Email Could be Sent , Please register first"})
    }
    const resetToken = await user.getResetPasswordToken()
    console.log(resetToken)
    await user.save()
    const resetUrl = `http://localhost:8080/passwordReset/${resetToken}`
    const message = `
    <h1>You have requested for password reset</h1>
    <p>pls go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `
    try {
        await sendEmail({
            to: user.email,
            subject: "Password rest request",
            text: message
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return next(res.status(500).json({message:"Email cannot be sent"}))
    }

    res.status(201).json({ success: true, message: "Email sent successfully" })
}

module.exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        res.status(404).json({message:"Invalid token"})
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res.status(201).json({ success: true, message: "Password Reset Success" })
}