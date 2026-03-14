const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { resolveCity } = require("./catalog");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Define the complex, deeply nested schema
const activitySchema = {
  type: SchemaType.OBJECT,
  properties: {
    place: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    estimated_budget_inr: { type: SchemaType.STRING }
  },
  required: ["place", "description", "estimated_budget_inr"]
};

const itinerarySchema = {
  type: SchemaType.OBJECT,
  properties: {
    destination: { type: SchemaType.STRING },
    duration: { type: SchemaType.STRING },
    budget_level: { type: SchemaType.STRING },
    travel_style: { type: SchemaType.STRING },
    estimated_total_trip_budget_inr: { type: SchemaType.STRING },
    itinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          theme: { type: SchemaType.STRING },
          activities: {
            type: SchemaType.OBJECT,
            properties: {
              morning: activitySchema,
              afternoon: activitySchema,
              evening: activitySchema
            },
            required: ["morning", "afternoon", "evening"]
          },
          hidden_gem: {
            type: SchemaType.OBJECT,
            properties: {
              place: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING }
            },
            required: ["place", "description"]
          },
          hotel_suggestion: { type: SchemaType.STRING },
          distances: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                from: { type: SchemaType.STRING },
                to: { type: SchemaType.STRING },
                distance_km: { type: SchemaType.STRING },
                travel_time: { type: SchemaType.STRING }
              },
              required: ["from", "to", "distance_km", "travel_time"]
            }
          },
          estimated_daily_budget_inr: { type: SchemaType.STRING }
        },
        required: [
          "day", "theme", "activities", "hidden_gem", 
          "hotel_suggestion", "distances", "estimated_daily_budget_inr"
        ]
      }
    }
  },
  required: [
    "destination", "duration", "budget_level", "travel_style", 
    "itinerary", "estimated_total_trip_budget_inr"
  ]
};

async function generateItinerary(data) {
  const resolved = resolveCity(data.destination);
  const cityData = resolved?.data || { attractions: [], hotels: [], restaurants: [] };
  const cityName = resolved?.name;
  if (cityName) {
    data.destination = cityName;
  }

  const normalizeBudget = (budget) => String(budget || "").toLowerCase();
  const budgetLevel = normalizeBudget(data.budget);
  const durationDays = Number.parseInt(String(data.duration || "0"), 10) || 0;
  let perDay = 0;

  if (budgetLevel.includes("low")) perDay = 2000;
  if (budgetLevel.includes("medium")) perDay = 4000;
  if (budgetLevel.includes("high")) perDay = 6000;

  const estimatedTotalTarget = perDay && durationDays ? perDay * durationDays : 0;

  // 2. Initialize the model with our strict configuration
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: itinerarySchema,
    }
  });

  // 3. Keep the prompt focused on instructions, not JSON formatting
  const prompt = `
You are a top-tier travel planner. Create a highly detailed travel itinerary.

Destination: ${data.destination}
Duration: ${data.duration} days
Budget Level: ${data.budget}
Travel Style: ${data.travel_style}
Travel Collaboration: ${data.collaboration || "Not specified"}
Travel Companion: ${data.travel_companion || "Not specified"}
Budget per day (guide): ${perDay ? `INR ${perDay}` : "Not specified"}
Target total budget (guide): ${estimatedTotalTarget ? `INR ${estimatedTotalTarget}` : "Not specified"}

${resolved ? "Use these attractions as main places:" : "No catalog data available. Choose top attractions based on your knowledge."}
${resolved ? JSON.stringify(cityData.attractions) : ""}

${resolved ? "Use these hotels:" : "Suggest suitable hotels based on the destination."}
${resolved ? JSON.stringify(cityData.hotels) : ""}

${resolved ? "Use these restaurants for food recommendations:" : "Suggest good local restaurants based on the destination."}
${resolved ? JSON.stringify(cityData.restaurants || []) : ""}

Requirements:
1. Plan each day with distinct morning, afternoon, and evening activities.
2. Include a unique, lesser-known "hidden gem" for each day.
3. Calculate logical routing: Include distances between locations.
4. Estimate realistic travel time between locations.
5. Estimate the cost for each activity in INR.
6. Suggest an appropriate hotel for each day from the provided list.
7. Include at least one restaurant experience each day from the provided list.
8. Calculate the estimated total daily budget in INR.
9. Calculate the estimated total trip budget in INR.
`;

  let text = "";
  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (err) {
    const reason = err?.message || "Gemini request failed";
    throw new Error(`Gemini request failed: ${reason}`);
  }

  // 4. Safely parse the guaranteed JSON
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini raw response:", text);
    throw new Error("Failed to parse the JSON response from Gemini.");
  }
}

module.exports = generateItinerary;
