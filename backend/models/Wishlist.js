const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({

userId:String,
place:String,
city:String

})

module.exports = mongoose.model("Wishlist",WishlistSchema)