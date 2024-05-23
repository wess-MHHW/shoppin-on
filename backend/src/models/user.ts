import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import User from "../utils/interfaces/user";

const schema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    validate: {
      validator: function (value: string) {
        let pattern = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
        return pattern.test(value);
      },
      message: function (propos) {
        return `"${propos.value}" is not a valid email!`;
      },
    },
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  photo: {
    type: String,
    required: [true, "Phone is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.comparePassword = async function (provided: string) {
  return await bcrypt.compare(provided, this.password);
};

const model: Model<User> = mongoose.model("customer", schema);

export default model;
