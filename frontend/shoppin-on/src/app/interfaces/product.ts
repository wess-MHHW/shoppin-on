import { Category } from './category';

export interface Product {
  _id: string;
  name: string;
  description: string;
  photos: Array<string>;
  quantity: number;
  unitPrice: number;
  price: number;
  discount: number;
  category: Category | null;
  createdAt: Date;
}
