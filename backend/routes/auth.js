const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const router = express.Router()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/signup", async(req,res)=>{

const {name,email,password} = req.body

if(!emailRegex.test(email || "")) {
return res.status(400).json({error:"Invalid email"})
}

if(!password || password.length < 6) {
return res.status(400).json({error:"Password must be at least 6 characters"})
}

const existing = await User.findOne({email})
if(existing){
return res.status(400).json({error:"Email already registered"})
}

const hash = await bcrypt.hash(password,10)

const user = new User({
name,email,password:hash
})

await user.save()

const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

res.json({token,user})

})

router.post("/login", async(req,res)=>{

const {email,password} = req.body

if(!emailRegex.test(email || "")) {
return res.status(400).json({error:"Invalid email"})
}

const user = await User.findOne({email})

if(!user)
return res.status(400).json({error:"Invalid login"})

const valid = await bcrypt.compare(password,user.password)

if(!valid)
return res.status(400).json({error:"Invalid login"})

const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

res.json({token,user})

})

module.exports = router
