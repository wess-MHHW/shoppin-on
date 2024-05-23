import { NextFunction, Request, Response } from "express";
import Category from "../models/category";
import Product from "../models/product";
import fs from "fs";
import CustomError from "../utils/classes/custom-error";
import handler from "../utils/functions/handler";

export const getCategory = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let category = await Category.findById(req.params.id);
    return res.status(200).json({
      status: "success",
      data: {
        categories: category,
      },
    });
  }
);

export const getCategories = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let categories = await Category.find().sort("-createdAt");
    return res.status(200).json({
      status: "success",
      data: {
        categories: categories,
      },
    });
  }
);

export const createCategory = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];

    if (!name) {
      for (const path of paths) {
        fs.rmSync(path);
      }
      next(new CustomError(400, "Category name is missing."));
      return;
    }

    if (paths.length !== 1) {
      if (paths.length !== 0) {
        for (const path of paths) {
          fs.rmSync(path);
        }
      }
      next(new CustomError(400, "Each category must have exactly one photo."));
      return;
    }

    let category: any = new Category({
      publisher: req.user._id,
      name,
      photo: paths[0],
    });

    category = await category.save();

    return res.json({ status: "success", data: { category } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    let category: any = await Category.findById(req.params.id);

    if (!category) {
      for (const path of paths) {
        fs.rmSync(path);
      }
      next(new CustomError(400, "No category with such identifier was found."));
      return;
    }

    if (name) {
      category!.name = name;
    }

    if (paths.length === 1) {
      fs.rmSync(category.photo);
      category!.photo = paths[0];
    }

    category = await category?.save();
    return res.json({ status: "success", data: { category } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const deleteCategory = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
      next(new CustomError(400, "No category with such identifier was found."));
      return;
    }

    fs.rmSync(category!.photo);

    await Product.updateMany(
      { publisher: req.user._id },
      { category: undefined }
    );

    await Category.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      status: "success",
      data: {
        category: null,
      },
    });
  }
);
