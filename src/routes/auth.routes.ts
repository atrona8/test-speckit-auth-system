import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// REQ-001 : Inscription
router.post("/register", authController.register);

// REQ-002 : Connexion
router.post("/login", authController.login);

// REQ-003 : Déconnexion (route protégée)
router.post("/logout", authenticate, authController.logout);

export default router;
