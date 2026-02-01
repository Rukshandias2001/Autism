import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

function fileFilter(_, file, cb) {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) cb(null, true);
  else cb(new Error("Only image/* or audio/* allowed."), false);
}

export const uploadSpeech = multer({ storage, fileFilter }).fields([
  { name: "imageFile", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);
