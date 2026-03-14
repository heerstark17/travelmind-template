# Trips-era
AI-assisted travel planner that generates structured itineraries with budgets, routing, hotels, and restaurant recommendations.

# Features
- Freeform prompt planning with semantic destination handling
- Questionnaire-based itinerary generation
- Day-by-day itinerary with routing and hidden gems
- Hotel booking links and restaurant recommendations
- Budget breakdown and travel options
- Collaboration and shared itineraries
- Wishlist and chat history
- Responsive, premium UI

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB
- AI: Google Gemini

## Repository Structure
- `frontend/` React app (Vite)
- `backend/` Express API

## Local Setup
1. Install dependencies
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Create `backend/.env` with:
   - `MONGO_URI=...`
   - `GEMINI_API_KEY=...`
   - `JWT_SECRET=...`
3. Run backend
   - `cd backend && node server.js`
4. Run frontend (new terminal)
   - `cd frontend && npm run dev`

#Run Locally (Quick)
1. `cd backend && npm install && node server.js`
2. In a new terminal: `cd frontend && npm install && npm run dev`

The frontend reads the API URL from `VITE_API_URL`. If not set, it defaults to `http://localhost:4000`.

# Deployment (Render + Vercel)
 Backend on Render:
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  - `MONGO_URI`
  - `GEMINI_API_KEY`
  - `JWT_SECRET`

 Frontend on Vercel:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<your-render-service>.onrender.com`

 API Health Check:
- `GET /` returns a plain text "API running" response.

 Notes
- If a destination is not in the local catalog, Gemini still generates an itinerary based on general knowledge.
- For production, use a strong `JWT_SECRET` value.
