require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// 1. Import SchemaType alongside GoogleGenerativeAI
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const questions = require("./knowledgeGraph");
const generateItinerary = require("./gemini");

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const chatRoutes = require("./routes/chat");

const app = express();

/* ---------- Middleware ---------- */

app.use(cors());
app.use(express.json());

/* ---------- MongoDB ---------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

/* ---------- Gemini Setup ---------- */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Define the schema for user intent extraction
const extractionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    destination: { type: SchemaType.STRING },
    duration: { type: SchemaType.STRING },
    budget: { type: SchemaType.STRING },
    travel_style: { type: SchemaType.STRING }
  },
  required: ["destination", "duration", "budget", "travel_style"]
};

/* ---------- Routes ---------- */

/* Auth */
app.use("/auth", authRoutes);

/* Wishlist */
app.use("/wishlist", wishlistRoutes);

/* Chat history */
app.use("/chat", chatRoutes);

/* ---------- Questionnaire Endpoint ---------- */

app.get("/questions", (req, res) => {
  res.json(questions);
});

/* ---------- Structured Itinerary Endpoint ---------- */

app.post("/itinerary", async (req, res) => {
  try {
    const itinerary = await generateItinerary(req.body);
    res.json(itinerary);
  } catch (error) {
    console.error("Itinerary error:", error);
    res.status(500).json({
      error: "Itinerary generation failed"
    });
  }
});

/* ---------- Prompt → Intent → Itinerary ---------- */

app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;

  try {
    // 3. Configure the model to force strict JSON output using the schema
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema,
      }
    });

    const extractionPrompt = `
Extract travel planning parameters from the following user prompt.
If the user does not specify a duration, budget, or travel style, leave those fields blank ("").

Prompt:
"${prompt}"
`;

    const result = await model.generateContent(extractionPrompt);
    const text = result.response.text();

    // 4. Safely parse without regex!
    const extracted = JSON.parse(text);

    /* Default handling for vague prompts */
    if (!extracted.duration) {
      extracted.duration = "3";
    }

    if (!extracted.budget) {
      extracted.budget = "Medium";
    }

    if (!extracted.travel_style) {
      extracted.travel_style = "Cultural";
    }

    // Pass the extracted (and defaulted) params to your new, hardened itinerary generator
    const itinerary = await generateItinerary(extracted);

    res.json({
      extracted_parameters: extracted,
      itinerary
    });

  } catch (error) {
    console.error("Prompt processing error:", error);
    res.status(500).json({
      error: "Prompt processing failed"
    });
  }
});

/* ---------- Health Check ---------- */

app.get("/", (req, res) => {
  res.send("TravelMind API running");
});

/* ---------- Start Server ---------- */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});