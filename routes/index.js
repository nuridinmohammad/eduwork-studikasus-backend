import express from "express";
const router = express()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Eduwork API Services" });
});

export default router