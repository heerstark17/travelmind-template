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

export function createShare(payload) {
  return API.post("/share", payload).then((res) => res.data);
}

export function fetchShare(id) {
  return API.get(`/share/${id}`).then((res) => res.data);
}

export function listShares(userId) {
  return API.get(`/share/user/${userId}`).then((res) => res.data);
}

export function addCollaborator(id, email) {
  return API.post(`/share/${id}/collaborators`, { email }).then((res) => res.data);
}

export function voteShare(id, userId, value) {
  return API.post(`/share/${id}/vote`, { userId, value }).then((res) => res.data);
}

export default API;
