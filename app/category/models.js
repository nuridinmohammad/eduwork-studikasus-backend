import mongoose from "mongoose";

const { model, Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    minlength: [3, "Panjang nama Kategori minimal 3 karakter"],
    maxlength: [20, "Panjang nama kategori maksimal 20 karakter "],
    required: [true, "Nama kategori harus diisi"],
  },
});

const Category = model("Category", categorySchema);

export default Category;
