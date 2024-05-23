import mongoose, { Schema, Model } from "mongoose";
import Product from "../utils/interfaces/porduct";

const schema: Schema<Product> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      default: "",
    },
    photos: {
      type: [String],
      required: [true, "Photos are required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    category: {
      type: Schema.ObjectId,
      ref: "category",
      optional: true,
    },
    publisher: {
      type: Schema.ObjectId,
      ref: "customer",
      required: [true, "Publisher is required"],
    },
  },
  { timestamps: true }
);

const model: Model<Product> = mongoose.model("product", schema);

export default model;
