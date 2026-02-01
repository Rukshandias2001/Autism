import axios from "axios";

// change baseURL if needed
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050",
});

// Assumed endpoints (adjust to yours):
// GET    /api/speech-cards
// POST   /api/speech-cards        (multipart form-data)
// PUT    /api/speech-cards/:id    (multipart form-data optional)
// DELETE /api/speech-cards/:id

export async function fetchSpeechCards() {
  const res = await api.get("/api/speech-cards");
  return res.data;
}

export async function createSpeechCard(formData) {
  const res = await api.post("/api/speech-cards", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateSpeechCard(id, formData) {
  const res = await api.put(`/api/speech-cards/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteSpeechCard(id) {
  const res = await api.delete(`/api/speech-cards/${id}`);
  return res.data;
}
