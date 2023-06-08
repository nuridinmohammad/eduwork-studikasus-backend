import mongoose from "mongoose";
import config_env from "../app/config.js";

const { dbUser, dbHost, dbName, dbPass, dbPort } = config_env;
mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
);
const db = mongoose.connection;

export default db;
