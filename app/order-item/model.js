import mongoose from "mongoose";

const { model, Schema } = mongoose;
const orderItemSchema = new Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama makanan minimal 5 karakter"],
    required: [true, "Nama Makanan harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "Harga Item harus diisi"],
  },
  qty: {
    type: Number,
    required: [true, "Kuatiti harus diisi"],
    min: [1, "Kuantiti miniaml 1"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});
const OrderItem = model("OrderItem", orderItemSchema);
export default OrderItem;
