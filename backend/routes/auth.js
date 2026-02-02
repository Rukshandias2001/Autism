import { Router } from "express";
import { signup, login, me, changePassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/change-password", requireAuth, changePassword);
router.get("/me", requireAuth, me);

export default router;
