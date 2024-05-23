import mongoose, { Model, Schema } from "mongoose";
import category from "../utils/interfaces/category";

const schema: Schema<category> = new mongoose.Schema(
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
    photo: {
      type: String,
      required: [true, "photo is required"],
    },
  },
  {
    timestamps: true,
  }
);

const model: Model<category> = mongoose.model("category", schema);

export default model;
