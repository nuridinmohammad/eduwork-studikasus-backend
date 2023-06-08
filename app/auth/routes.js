import express from "express";
import passport from "passport";
import PassportLocal from "passport-local";

import authController from "./controller.js";

const router = express();
const localStrategy = new PassportLocal(
  { usernameField: "email" },
  authController.localStrategy
);

passport.use(localStrategy);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

export default router;
