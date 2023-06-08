import express from "express";

const router = express();

router.get("/invoices/:order_id");
export default router;
