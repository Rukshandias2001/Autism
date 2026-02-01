import express from "express";
import { uploadSpeech } from "../middleware/uploadSpeech.js";
import {
  getSpeechCards,
  createSpeechCard,
  updateSpeechCard,
  deleteSpeechCard,
} from "../controllers/speechCardController.js";

const router = express.Router();

router.get("/", getSpeechCards);
router.post("/", uploadSpeech, createSpeechCard);
router.put("/:id", uploadSpeech, updateSpeechCard);
router.delete("/:id", deleteSpeechCard);

export default router;
