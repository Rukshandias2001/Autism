import SpeechCard from "../models/SpeechCard.model.js";

import fs from "fs";

function publicUrl(req, filename) {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

function deleteLocalIfNeeded(url) {
  try {
    if (url?.includes("/uploads/")) {
      const filename = url.split("/uploads/")[1];
      fs.unlinkSync(`uploads/${filename}`);
    }
  } catch {}
}

export async function getSpeechCards(req, res) {
  const items = await SpeechCard.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function createSpeechCard(req, res) {
    console.log("HIT /api/speech-cards POST");
    console.log("body keys:", Object.keys(req.body || {}));
    console.log("files keys:", Object.keys(req.files || {}));

  const { title, category, difficulty } = req.body;

  const imageFile = req.files?.imageFile?.[0];
  const audioFile = req.files?.audioFile?.[0];

  const image = imageFile ? publicUrl(req, imageFile.filename) : (req.body.image || "").trim();
  const audio = audioFile ? publicUrl(req, audioFile.filename) : (req.body.audio || "").trim();

  if (!title?.trim()) return res.status(400).json({ message: "title is required" });
  if (!category?.trim()) return res.status(400).json({ message: "category is required" });
  if (!image) return res.status(400).json({ message: "image is required" });
  if (!audio) return res.status(400).json({ message: "audio is required" });

  const doc = await SpeechCard.create({
    title: title.trim(),
    category: category.trim(),
    difficulty: difficulty || "easy",
    image,
    audio,
  });

  res.status(201).json(doc);
}

export async function updateSpeechCard(req, res) {
  const { id } = req.params;
  const existing = await SpeechCard.findById(id);
  if (!existing) return res.status(404).json({ message: "Not found" });

  const { title, category, difficulty } = req.body;

  const imageFile = req.files?.imageFile?.[0];
  const audioFile = req.files?.audioFile?.[0];

  let image = (req.body.image || "").trim();
  let audio = (req.body.audio || "").trim();

  if (imageFile) {
    deleteLocalIfNeeded(existing.image);
    image = publicUrl(req, imageFile.filename);
  }
  if (audioFile) {
    deleteLocalIfNeeded(existing.audio);
    audio = publicUrl(req, audioFile.filename);
  }

  existing.title = title?.trim() || existing.title;
  existing.category = category?.trim() || existing.category;
  existing.difficulty = difficulty || existing.difficulty;
  existing.image = image || existing.image;
  existing.audio = audio || existing.audio;

  await existing.save();
  res.json(existing);
}

export async function deleteSpeechCard(req, res) {
  const { id } = req.params;
  const existing = await SpeechCard.findById(id);
  if (!existing) return res.status(404).json({ message: "Not found" });

  deleteLocalIfNeeded(existing.image);
  deleteLocalIfNeeded(existing.audio);

  await SpeechCard.deleteOne({ _id: id });
  res.json({ message: "Deleted", id });
}
