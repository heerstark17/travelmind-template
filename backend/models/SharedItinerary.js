const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
  userId: String,
  value: { type: Number, enum: [-1, 1] }
}, { _id: false })

const SharedItinerarySchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  title: { type: String, default: "Shared itinerary" },
  itinerary: { type: Object, required: true },
  meta: { type: Object, default: {} },
  collaborators: { type: [String], default: [] },
  votes: { type: [VoteSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("SharedItinerary", SharedItinerarySchema)
