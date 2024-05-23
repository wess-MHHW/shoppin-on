import { Schema } from "mongoose";

export default interface Order {
  _id: string;
  phone: Number;
  name: string;
  email: string;
  address: string;
  status: string;
  code: Object;
  products: Array<{ product: typeof Schema.ObjectId; quantity: number }>;
}

/* 
  let status: Array<string> = [
    "Processing",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]; 
*/
