import mongoose, { Model, Schema } from "mongoose";
import Coupon from "../utils/interfaces/coupon";

const schema: Schema<Coupon> = new mongoose.Schema(
  {
    publisher: {
      type: Schema.ObjectId,
      ref: "customer",
      required: [true, "Publisher is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    value: {
      type: Number,
      required: [true, "Value is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const model: Model<Coupon> = mongoose.model("coupon", schema);

export default model;
