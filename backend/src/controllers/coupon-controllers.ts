import { NextFunction, Response } from "express";
import CustomError from "../utils/classes/custom-error";
import Coupon from ".././models/coupon";
import handler from "../utils/functions/handler";

export const createCoupon = handler(
  async (req: any, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { name, value } = req.body;
    if (!name) {
      next(new CustomError(400, "Coupon name is missing."));
      return;
    }

    if (value === undefined) {
      next(new CustomError(400, "Coupon value is missing."));
      return;
    }

    if (value < 0 || value > 1) {
      next(new CustomError(400, "Coupon value must be in [0,1]."));
      return;
    }

    let coupon = new Coupon({ publisher: req.user._id, name, value });

    coupon = await coupon.save();
    return res.status(201).json({
      status: "success",
      data: {
        coupon: coupon,
      },
    });
  }
);

export const getCoupon = handler(
  async (req: any, res: Response, next: NextFunction) => {
    const name = req.params.name;

    let coupon = await Coupon.findOne({ name, active: true });

    return res.status(200).json({
      status: "success",
      data: {
        coupon,
      },
    });
  }
);

export const getCoupons = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let coupons = await Coupon.find({ publisher: req.user._id }).sort(
      "-createdAt"
    );
    return res.status(200).json({
      status: "success",
      data: {
        coupons: coupons,
      },
    });
  }
);

export const updateCoupon = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "success",
      data: {
        coupon: coupon,
      },
    });
  }
);

export const deleteCoupon = handler(
  async (req: any, res: Response, next: NextFunction) => {
    await Coupon.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      data: {
        coupon: null,
      },
    });
  }
);
