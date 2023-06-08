import mongoose from "mongoose";

const { Schema, model } = mongoose;
const schemaDeliveryAddress = new Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama Alamat harus diisi"],
      maxlength: [255, "Panjang maksimal nama Alamat adalah 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Nama Kelurahan harus diisi"],
      maxlength: [255, "Panjang maksimal nama Kelurahan adalah 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "Nama Kecamatan harus diisi"],
      maxlength: [255, "Panjang maksimal nama Kecamatan adalah 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten harus diisi"],
      maxlength: [255, "Panjang maksimal nama Kabupaten adalah 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi harus diisi"],
      maxlength: [255, "Panjang maksimal nama Provinsi adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail harus diisi"],
      maxlength: [10000, "Panjang maksimal nama Detail adalah 10000 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const DeliveryAddress = model("DeliveryAddress", schemaDeliveryAddress);
export default DeliveryAddress;
