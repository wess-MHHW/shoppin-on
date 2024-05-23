import { Schema } from "mongoose";

export default interface Coupon {
  _id: string;
  publisher: typeof Schema.ObjectId;
  name: string;
  value: number;
  active: boolean;
}
