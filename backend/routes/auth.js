const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const router = express.Router()

router.post("/signup", async(req,res)=>{

const {name,email,password} = req.body

const hash = await bcrypt.hash(password,10)

const user = new User({
name,email,password:hash
})

await user.save()

res.json({message:"User created"})

})

router.post("/login", async(req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email})

const valid = await bcrypt.compare(password,user.password)

if(!valid)
return res.status(400).json({error:"Invalid login"})

const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

res.json({token,user})

})

module.exports = router