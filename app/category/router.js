import express from "express";
import categoryController from "./controller.js";
import { policy_check } from "../../middlewares/index.js";

const router = express();

router.get("/categories", categoryController.index);

router.post("/category", policy_check("create","Category"),categoryController.store);

router.put("/category/:id", policy_check("update","Category"),categoryController.update);

router.delete("/category/:id", policy_check("delete","Category"),categoryController.destroy);

export default router;
