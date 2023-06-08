import mongoose from "mongoose";
const { model, Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter "],
      required: [true, "Nama makanan harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang nama makanan minimal 1000 karakter "],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  },
  { timestamps: true }
);
const Product = model("Product", productSchema);

export default Product;
