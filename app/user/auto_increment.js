import mongoose from "mongoose";

const { model, Schema } = mongoose;
const autoIncrementSchema = new Schema({
  id: String,
  seq: Number,
});

const AutoIncrement = model("AutoIncrement", autoIncrementSchema);

export default AutoIncrement;
