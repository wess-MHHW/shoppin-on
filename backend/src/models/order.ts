import mongoose, { Model, Schema } from "mongoose";
import Order from "../utils/interfaces/order";

const schema: Schema<Order> = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: [true, "Phone is required"],
    },
    email: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    status: {
      type: String,
      default: "Processing",
    },
    code: {
      type: Object,
    },
    products: {
      type: [Object],
      required: [true, "Products are required"],
    },
  },
  { timestamps: true }
);

const model: Model<Order> = mongoose.model("order", schema);

export default model;
