import { Schema } from "mongoose";

export default interface category {
  _id: string;
  name: string;
  photo: string;
  publisher: typeof Schema.ObjectId;
}
