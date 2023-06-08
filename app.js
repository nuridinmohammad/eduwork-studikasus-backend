import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import productRoutes from "./app/product/router.js";
import categoryRoutes from "./app/category/router.js";
import tagRoutes from "./app/tag/router.js";
import authRoutes from "./app/auth/routes.js";
import deliveryAddressRouter from "./app/deliveryAddress/router.js";
import cartRoutes from "./app/cart/router.js";
import orderRoutes from "./app/order/router.js";
import invoiceRoutes from './app/invoice/router.js' 
import { decodeToken } from "./middlewares/index.js";

const app = express();
const __dirname = path.resolve();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(decodeToken());

// home root api services
app.use("/", indexRouter);

// route auth
app.use("/auth", authRoutes);

//route main data
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", deliveryAddressRouter);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", invoiceRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
