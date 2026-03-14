require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// 1. Import SchemaType alongside GoogleGenerativeAI
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const questions = require("./knowledgeGraph");
const { resolveCity, listCities, getNearbyCities } = require("./catalog");
const generateItinerary = require("./gemini");

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const chatRoutes = require("./routes/chat");
const sharedRoutes = require("./routes/shared");

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
    travel_style: { type: SchemaType.STRING },
    collaboration: { type: SchemaType.STRING },
    travel_companion: { type: SchemaType.STRING },
    checkin_date: { type: SchemaType.STRING },
    checkout_date: { type: SchemaType.STRING }
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

/* Shared itineraries */
app.use("/share", sharedRoutes);

/* ---------- Questionnaire Endpoint ---------- */

app.get("/questions", (req, res) => {
  res.json(questions);
});

/* ---------- Catalog Lookup ---------- */

app.get("/catalog/:city", (req, res) => {
  const resolved = resolveCity(req.params.city);

  if (!resolved) {
    return res.status(404).json({
      error: "City not found in catalog",
      suggestions: listCities()
    });
  }

  return res.json({
    city: resolved.name,
    data: resolved.data,
    corrected: Boolean(resolved.corrected)
  });
});

/* ---------- Structured Itinerary Endpoint ---------- */

app.post("/itinerary", async (req, res) => {
  try {
    const resolved = resolveCity(req.body?.destination);

    if (!resolved) {
      const itinerary = await generateItinerary({
        ...req.body,
        destination: req.body?.destination
      });
      itinerary.note = "City not found in catalog. Generated with Gemini.";
      res.json(itinerary);
      return;
    }

    const itinerary = await generateItinerary({
      ...req.body,
      destination: resolved.name
    });

    itinerary.nearby_cities = getNearbyCities(itinerary.destination, 20);
    res.json(itinerary);
  } catch (error) {
    console.error("Itinerary error:", error);
    res.status(500).json({
      error: "Itinerary generation failed",
      details: error?.message || "Unknown error"
    });
  }
});

/* ---------- Prompt → Intent → Itinerary ---------- */

app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;

  try {
    const availableCities = listCities();

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
If the user does not specify a destination city, leave "destination" blank.

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

    if (!extracted.collaboration) {
      extracted.collaboration = "Solo planning";
    }

    if (!extracted.travel_companion) {
      extracted.travel_companion = "Solo";
    }

    const suggestDestinations = (text) => {
      const value = String(text || "").toLowerCase();

      const matchers = [
        {
          keywords: ["mountain", "mountains", "hills", "snow", "trek", "hiking"],
          options: ["Manali", "Shimla", "Rishikesh"]
        },
        {
          keywords: ["beach", "coast", "sea", "island"],
          options: ["Goa", "Kerala"]
        },
        {
          keywords: ["heritage", "history", "palace", "fort", "culture"],
          options: ["Jaipur", "Udaipur", "Delhi", "Agra"]
        },
        {
          keywords: ["food", "cuisine", "street food"],
          options: ["Delhi", "Mumbai", "Kolkata", "Hyderabad"]
        },
        {
          keywords: ["spiritual", "temple", "ghat", "yoga"],
          options: ["Varanasi", "Rishikesh"]
        },
        {
          keywords: ["nature", "wildlife", "backwaters"],
          options: ["Kerala", "Goa", "Rishikesh"]
        }
      ];

      for (const group of matchers) {
        if (group.keywords.some((keyword) => value.includes(keyword))) {
          return group.options.filter((city) => availableCities.includes(city));
        }
      }

      return availableCities.slice(0, 3);
    };

    if (!extracted.destination) {
      const fallbackSchema = {
        type: SchemaType.OBJECT,
        properties: {
          destination: { type: SchemaType.STRING }
        },
        required: ["destination"]
      };

      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: fallbackSchema,
        }
      });

      const fallbackPrompt = `
You are a travel planner. User's prompt is: "${prompt}"
Pick the single best Indian city matching the user's semantics.
Return JSON with:
1) "destination": city name
`;

      const fallbackResult = await fallbackModel.generateContent(fallbackPrompt);
      const fallbackText = fallbackResult.response.text();
      let fallback;

      try {
        fallback = JSON.parse(fallbackText);
      } catch (err) {
        console.error("Fallback parse error:", fallbackText);
        return res.status(500).json({ error: "Prompt processing failed" });
      }

      extracted.destination = fallback.destination;
    }

    let resolved = resolveCity(extracted.destination);

    if (!resolved) {
      const itinerary = await generateItinerary({
        ...extracted,
        destination: extracted.destination
      });

      return res.json({
        extracted_parameters: extracted,
        itinerary,
        note: "City not found in catalog. Generated with Gemini."
      });
    }

    if (!resolved) {
      return res.status(404).json({
        error: "City not found in catalog",
        suggestions: listCities()
      });
    }

    // Pass the extracted (and defaulted) params to your new, hardened itinerary generator
    const itinerary = await generateItinerary({
      ...extracted,
      destination: resolved.name
    });

    itinerary.nearby_cities = getNearbyCities(itinerary.destination, 20);

    res.json({
      extracted_parameters: {
        ...extracted,
        destination: resolved.name,
        destination_options: extracted.destination_options || []
      },
      itinerary
    });

  } catch (error) {
    console.error("Prompt processing error:", error);
    res.status(500).json({
      error: "Prompt processing failed",
      details: error?.message || "Unknown error"
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
