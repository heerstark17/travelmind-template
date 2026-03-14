import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API = axios.create({
  baseURL: API_BASE_URL
});

export function signup(payload) {
  return API.post("/auth/signup", payload).then((res) => res.data);
}

export function login(payload) {
  return API.post("/auth/login", payload).then((res) => res.data);
}

export function fetchQuestions() {
  return API.get("/questions").then((res) => res.data);
}

export function generateItinerary(payload) {
  return API.post("/itinerary", payload).then((res) => res.data);
}

export function generateFromPrompt(prompt) {
  return API.post("/prompt", { prompt }).then((res) => res.data);
}

export function addWishlist(payload) {
  return API.post("/wishlist/add", payload).then((res) => res.data);
}

export function fetchWishlist(userId) {
  return API.get(`/wishlist/${userId}`).then((res) => res.data);
}

export function saveChatHistory(payload) {
  return API.post("/chat/save", payload).then((res) => res.data);
}

export function fetchChatHistory(userId) {
  return API.get(`/chat/${userId}`).then((res) => res.data);
}

export function fetchCatalogCity(city) {
  return API.get(`/catalog/${encodeURIComponent(city)}`).then((res) => res.data);
}

export default API;
