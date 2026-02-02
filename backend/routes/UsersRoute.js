import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { changePassword } from "../controllers/authController.js";

const router = Router();

// POST /api/users/change-password
router.post("/change-password", requireAuth, changePassword);

export default router;

// Note: users routes for profile/password actions
