import { Coupon } from './coupon';
import { Product } from './product';

export interface Order {
  _id: string;
  name: string;
  email?: string;
  phone: number;
  address: string;
  code?: Coupon;
  status: string;
  createdAt: Date;
  products: Array<{ product: Product; quantity: number }>;
}
