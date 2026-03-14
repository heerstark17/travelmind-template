require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const questions = require("./knowledgeGraph")
const generateItinerary = require("./gemini")

const authRoutes = require("./routes/auth")
const wishlistRoutes = require("./routes/wishlist")
const chatRoutes = require("./routes/chat")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

app.use("/auth",authRoutes)
app.use("/wishlist",wishlistRoutes)
app.use("/chat",chatRoutes)

app.get("/questions",(req,res)=>{

res.json(questions)

})

app.post("/itinerary", async(req,res)=>{

const result = await generateItinerary(req.body)

res.json(result)

})

app.listen(process.env.PORT,()=>{

console.log("Server running")

})