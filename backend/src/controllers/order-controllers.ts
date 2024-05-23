import { NextFunction, Response } from "express";
import Order from "../models/order";
import Product from "../models/product";
import CustomError from "../utils/classes/custom-error";

export const updateOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const status = req.body.status;
  let order = await Order.findById(req.params.id);
  if (!order) {
    next(new CustomError(400, "Order not found."));
    return;
  }

  if (order.status === "Processing") {
    let l: Array<{ _id: any; name: any; quantity: number }> =
      order.products.map((item: any) => {
        return {
          _id: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
        };
      });
    for (let element of l) {
      const product = await Product.findById(element._id);
      if (product) {
        const newQuantity = product.quantity - element.quantity;
        if (newQuantity < 0) {
          next(
            new CustomError(
              400,
              `Insufficient stock for product ${element.name}`
            )
          );
          return;
        } else {
          product.quantity = newQuantity;
          await product.save();
        }
      }
    }
  } else if (order.status === "Confirmed" && status === "Processing") {
    let l: Array<{ _id: any; name: any; quantity: number }> =
      order.products.map((item: any) => {
        return {
          _id: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
        };
      });
    for (let element of l) {
      const product = await Product.findById(element._id);
      if (product) {
        const newQuantity = product.quantity + element.quantity;

        product.quantity = newQuantity;
        await product.save();
      }
    }
  }

  order!.status = status;

  order = await order!.save();
  return res.status(200).json({
    status: "success",
    data: {
      order: order,
    },
  });
};

export const getOrderStats = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let processing = await Order.countDocuments({ status: "Processing" });
  let confirmed = await Order.countDocuments({ status: "Confirmed" });
  let shipped = await Order.countDocuments({ status: "Shipped" });
  let delivered = await Order.countDocuments({ status: "Delivered" });
  let cancelled = await Order.countDocuments({ status: "Cancelled" });
  return res.status(200).json({
    status: "success",
    data: {
      processing,
      confirmed,
      shipped,
      delivered,
      cancelled,
    },
  });
};

export const cancelOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "Cancelled",
    },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};

export const createOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let { name, phone, address, code, products, email } = req.body;
  if (!name) {
    next(new CustomError(400, "Name is missing."));
    return;
  }

  if (!phone) {
    next(new CustomError(400, "Phone number is missing."));
    return;
  }

  if (!address) {
    next(new CustomError(400, "Address is missing."));
    return;
  }

  if (products.length === 0) {
    next(new CustomError(400, "Orders must contain at least one product."));
    return;
  }

  const productIds = products.map((item: any) => item.product._id);

  const productQuantities = await Product.find({
    _id: { $in: productIds },
  }).select({ quantity: 1 });

  const unavailable = [];

  for (const product of products) {
    const matchingProduct = productQuantities.find(
      (p) => p._id.toString() === product.product._id
    );

    if (!matchingProduct || matchingProduct.quantity < product.quantity) {
      unavailable.push({
        _id: product.product._id,
        name: product.product.name,
        available: matchingProduct ? matchingProduct.quantity : 0,
      });
    }
  }

  if (unavailable.length !== 0) {
    return res.status(200).json({
      status: "success",
      data: {
        unavailable,
      },
    });
  }

  let order: any = new Order({
    name,
    email,
    phone,
    address,
    status: "Processing",
    code,
    products,
  });

  order = await order.save();
  return res.status(200).json({
    status: "success",
    data: {
      order: order,
    },
  });
};

export const getOrder = async (req: any, res: Response, next: NextFunction) => {
  let order = await Order.findById(req.params.id);
  return res.status(200).json({
    status: "success",
    data: {
      order: order,
    },
  });
};

export const getOrders = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let orders = await Order.find({ phone: req.params.phone }).sort("-createdAt");
  return res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
};

export const filterOrders = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let queryObject = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((item) => delete queryObject[item]);
  let queryString = JSON.stringify(queryObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  queryObject = JSON.parse(queryString);
  let query = Order.find({ ...queryObject });
  const countQuery = Order.find({ ...queryObject });

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort({ createdAt: -1 });
  }
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const totalRecords = await countQuery.countDocuments();

  query = query.skip(skip).limit(limit);

  let orders = await query;
  return res.status(200).json({
    status: "success",
    totalPages: Math.ceil(totalRecords / limit),
    page,
    limit,
    length: totalRecords,
    data: {
      orders,
    },
  });
};
