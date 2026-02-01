import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050",
});

export async function fetchSpeechCards() {
  const res = await api.get("/api/speech-cards");
  return res.data;
}

export async function createSpeechCard(formData) {
  // ✅ DO NOT set Content-Type manually (axios will add boundary automatically)
  console.log("--------------------------------------")
  console.log(formData)
  console.log("--------------------------------------")
  const res = await api.post("/api/speech-cards", formData);
  return res.data;
}

export async function updateSpeechCard(id, formData) {
  // ✅ DO NOT set Content-Type manually
  const res = await api.put(`/api/speech-cards/${id}`, formData);
  return res.data;
}

export async function deleteSpeechCard(id) {
  const res = await api.delete(`/api/speech-cards/${id}`);
  return res.data;
}
