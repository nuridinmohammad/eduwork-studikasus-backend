import express from "express";
import invoicesController from "./controller.js";

const router = express();

router.get("/invoices/:order_id", invoicesController.show);
export default router;
