const express = require("express")
const Chat = require("../models/ChatHistory")

const router = express.Router()

router.post("/save", async(req,res)=>{

const {userId,query,response} = req.body

const chat = new Chat({
userId,query,response
})

await chat.save()

res.json({message:"Saved"})

})

router.get("/:userId", async(req,res)=>{

const chats = await Chat.find({
userId:req.params.userId
})

res.json(chats)

})

module.exports = router