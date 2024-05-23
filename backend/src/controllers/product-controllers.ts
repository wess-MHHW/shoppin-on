import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import Order from "../models/order";
import fs from "fs";
import CustomError from "../utils/classes/custom-error";
import handler from "../utils/functions/handler";

export const createPorduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, qunaity, unitPrice, price, discount, category } =
      req.body;

    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];

    if (!name || !unitPrice || !price || paths.length === 0) {
      if (paths.length !== 0) {
        for (const path of paths) {
          fs.rmSync(path);
        }
      }

      if (!name) {
        next(new CustomError(400, "Product name is missing."));
        return;
      } else if (!unitPrice) {
        next(new CustomError(400, "Product unit price is missing."));
        return;
      } else if (!price) {
        next(new CustomError(400, "Product price is missing."));
        return;
      } else {
        next(
          new CustomError(400, "Each category must have at lease one photo.")
        );
        return;
      }
    }

    let product: any = new Product({
      publisher: req.user._id,
      name,
      description: description ?? "",
      photos: paths,
      quantity: qunaity ?? 0,
      unitPrice,
      price,
      discount: discount ?? 0,
    });

    if (category) {
      product.category = category;
    }

    product = await product.save();

    return res.json({ status: "success", data: { product } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const deleteProduct = handler(
  async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      for (const path of product.photos) {
        fs.rmSync(path);
      }
    }
    return res.status(200).json({
      status: "success",
      data: {
        product: null,
      },
    });
  }
);

export const updatePorduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const array = req.files as Array<Object>;

    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];

    let product = await Product.findById(id);

    if (!product) {
      for (const path of paths) {
        fs.rmSync(path);
      }
      next(new CustomError(400, "No Porduct with such identifier was found."));
      return;
    }

    let photos = JSON.parse(req.body.photos);

    product!.photos.forEach((element: any) => {
      if (!photos.includes(element)) {
        fs.rmSync(element);
      }
    });

    req.body.photos = [...photos, ...paths];

    if (req.body.category === "") {
      req.body.category = undefined;
    }

    product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ status: "success", data: { product } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const getBestSellers = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let orders = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled", "Processing"] },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product._id",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);

    let products = orders.map((item) => {
      return { totalQuantity: item.totalQuantity, product: item._id };
    });

    let ids = products.map((item: any) => item.product);

    let result = await Product.find({ _id: { $in: ids } }).populate("category");

    products = products.map((item) => {
      return {
        totalQuantity: item.totalQuantity,
        product: result.find((e) => e._id.toString() === item.product),
      };
    });

    return res.status(200).json({
      status: "success",
      length: products.length,
      data: {
        products,
      },
    });
  }
);

export const filterProducts = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let queryObject = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((item) => delete queryObject[item]);
    console.log(queryObject);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    queryObject = JSON.parse(queryString);
    console.log(queryObject);

    if (queryObject.name) {
      queryObject.name = { $regex: `^${queryObject.name}`, $options: "i" };
    }

    let query = Product.find({ ...queryObject }).populate("category");
    const countQuery = Product.find({ ...queryObject });

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

    let products = await query;

    return res.status(200).json({
      status: "success",
      totalPages: Math.ceil(totalRecords / limit),
      page,
      limit,
      length: totalRecords,
      data: {
        products,
      },
    });
  }
);
