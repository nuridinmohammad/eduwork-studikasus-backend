import express from "express";
import tagController from "./controller.js";
import { policy_check } from "../../middlewares/index.js";

const router = express();

router.get("/tags", tagController.index);

router.post("/tag", policy_check("create", "Tag"), tagController.store);

router.put("/tag/:id", policy_check("update", "Tag"), tagController.update);

router.delete("/tag/:id", policy_check("delete", "Tag"), tagController.destroy);

export default router;
