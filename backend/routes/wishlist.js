const express = require("express")
const Wishlist = require("../models/Wishlist")

const router = express.Router()

router.post("/add", async(req,res)=>{

const {userId,place,city} = req.body

const item = new Wishlist({
userId,place,city
})

await item.save()

res.json({message:"Added"})

})

router.get("/:userId", async(req,res)=>{

const items = await Wishlist.find({
userId:req.params.userId
})

res.json(items)

})

module.exports = router