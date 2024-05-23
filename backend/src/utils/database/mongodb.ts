import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING!).then(() => {
  console.log("MongoDB connected successfully");
});
