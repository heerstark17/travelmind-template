const express = require("express")
const SharedItinerary = require("../models/SharedItinerary")

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { ownerId, title, itinerary, meta } = req.body

    if (!ownerId || !itinerary) {
      return res.status(400).json({ error: "ownerId and itinerary are required" })
    }

    const shared = new SharedItinerary({
      ownerId,
      title: title || "Shared itinerary",
      itinerary,
      meta: meta || {}
    })

    await shared.save()
    res.json(shared)
  } catch (err) {
    console.error("Share create error:", err)
    res.status(500).json({ error: "Share create failed" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const shared = await SharedItinerary.findById(req.params.id)
    if (!shared) {
      return res.status(404).json({ error: "Shared itinerary not found" })
    }
    res.json(shared)
  } catch (err) {
    console.error("Share get error:", err)
    res.status(500).json({ error: "Share fetch failed" })
  }
})

router.get("/user/:userId", async (req, res) => {
  try {
    const owned = await SharedItinerary.find({ ownerId: req.params.userId }).sort({ createdAt: -1 })
    res.json(owned)
  } catch (err) {
    console.error("Share list error:", err)
    res.status(500).json({ error: "Share list failed" })
  }
})

router.post("/:id/collaborators", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: "email required" })
    }

    const shared = await SharedItinerary.findById(req.params.id)
    if (!shared) {
      return res.status(404).json({ error: "Shared itinerary not found" })
    }

    if (!shared.collaborators.includes(email)) {
      shared.collaborators.push(email)
      await shared.save()
    }

    res.json(shared)
  } catch (err) {
    console.error("Share collaborators error:", err)
    res.status(500).json({ error: "Add collaborator failed" })
  }
})

router.post("/:id/vote", async (req, res) => {
  try {
    const { userId, value } = req.body

    if (!value || ![-1, 1].includes(value)) {
      return res.status(400).json({ error: "vote value must be -1 or 1" })
    }

    const shared = await SharedItinerary.findById(req.params.id)
    if (!shared) {
      return res.status(404).json({ error: "Shared itinerary not found" })
    }

    const existing = shared.votes.find((vote) => vote.userId === userId)
    if (existing) {
      existing.value = value
    } else {
      shared.votes.push({ userId: userId || "anonymous", value })
    }

    await shared.save()
    res.json(shared)
  } catch (err) {
    console.error("Share vote error:", err)
    res.status(500).json({ error: "Vote failed" })
  }
})

module.exports = router
