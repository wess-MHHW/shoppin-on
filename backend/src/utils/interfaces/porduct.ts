import { Schema } from "mongoose";

export default interface Product {
  _id: string;
  name: string;
  description: string;
  photos: Array<string>;
  quantity: number;
  unitPrice: number;
  price: number;
  discount: number;
  publisher: typeof Schema.ObjectId;
  category: typeof Schema.ObjectId;
  tags: Array<string>;
}
