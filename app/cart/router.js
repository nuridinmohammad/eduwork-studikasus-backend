import express from "express";
import CartController from "./controller.js";
import { policy_check } from "../../middlewares/index.js";

const router = express();

router.put("/carts", policy_check("update", "Cart"), CartController.update);
router.get("/carts", policy_check("read", "Cart"), CartController.index);

export default router;
