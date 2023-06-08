import express from "express";
import orderController from "./controller.js";
import { policy_check } from "../../middlewares/index.js";

const router = express();

router.post("/orders", policy_check("create", "Order"), orderController.store);
router.get("/orders", policy_check("view", "Order"), orderController.index);

export default router;
