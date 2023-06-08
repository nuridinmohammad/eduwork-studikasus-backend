import mongoose from "mongoose";

const { model, Schema } = mongoose;
const invoiceSchema = new Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "sub_total harus diisi"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "delivery_fee harus diisi"],
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus diisi."] },
      kabupaten: { type: String, required: [true, "Kabupaten harus diisi."] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi."] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi."] },
      detail: { type: String },
    },
    total: { type: Number, required: [true, "total harus diisi"] },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);
const Invoice = model("Invoice", invoiceSchema);
export default Invoice;
