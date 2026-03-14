const axios = require("axios")
const catalog = require("./catalog")

async function generateItinerary(data){

const cityData = catalog[data.destination]

const prompt = `
Create itinerary JSON.

Destination:${data.destination}
Duration:${data.duration}
Budget:${data.budget}
Travel style:${data.travel_style}

Attractions:${JSON.stringify(cityData.attractions)}
Hotels:${JSON.stringify(cityData.hotels)}
`

const response = await axios.post(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
contents:[
{
parts:[
{ text: prompt }
]
}
]
}
)

const text =
response.data.candidates[0].content.parts[0].text

return JSON.parse(text)

}

module.exports = generateItinerary
