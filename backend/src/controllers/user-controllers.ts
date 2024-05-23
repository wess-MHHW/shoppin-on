import Customer from "../models/user";
import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/classes/custom-error";
import fs from "fs";
import generateToken from "../utils/functions/generate-token";
import handler from "../utils/functions/handler";
import verifyToken from "../utils/functions/verify-token";
import { JwtPayload } from "jsonwebtoken";

export const login = handler(
  async (req: Request, res: Response, next: NextFunction) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    if (!username || !password) {
      next(new CustomError(400, "Missing Credentials."));
      return;
    }

    let user: any = await Customer.findOne({ username }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      next(new CustomError(400, "Invalid Credantilas."));
      return;
    }

    let result: any = {};
    Object.keys(user._doc).forEach((key) => {
      if (key !== "password") {
        result[key] = user[key];
      }
    });

    const token = generateToken(user._id);

    return res.status(200).json({
      status: "success",
      token,
      data: {
        user: result,
      },
    });
  }
);

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users: any = await Customer.find();

  return res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone } = req.body;

    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];

    if (!name) {
      next(new CustomError(400, "User name is missing."));
      return;
    }

    if (!email) {
      next(new CustomError(400, "User email is missing."));
      return;
    }

    if (!phone) {
      next(new CustomError(400, "User phone is missing."));
      return;
    }

    if (paths.length !== 1) {
      if (paths.length !== 0) {
        for (const path of paths) {
          fs.rmSync(path);
        }
      }
      next(new CustomError(400, "Each user must have exactly one photo."));
      return;
    }

    let password = Math.random().toString(20).slice(-8);

    let user: any = new Customer({
      name,
      username: name + "@ecommerce.tn",
      email,
      phone,
      photo: paths[0],
      password,
    });

    user = await user.save();

    let result: any = {};
    Object.keys(user._doc).forEach((key) => {
      if (key !== "password") {
        result[key] = user[key];
      }
    });
    result["password"] = password;
    return res.json({ status: "success", data: { user: result } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const updateUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: any = await Customer.findById(req.user.id).select("+password");

    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];

    if (paths.length !== 1) {
      if (paths.length !== 0) {
        for (const path of paths) {
          fs.rmSync(path);
        }
      }
    } else {
      fs.rmSync(user.photo);
      user.photo = paths[0];
    }

    const { password, newPassword } = req.body;
    if (password && !newPassword) {
      next(new CustomError(400, "New password is missing."));
      return;
    }

    if (password) {
      if (!user || !(await user.comparePassword(password))) {
        next(new CustomError(400, "Invalid password."));
        return;
      }

      user.password = newPassword;
    }

    user = await user.save();
    let result: any = {};
    Object.keys(user._doc).forEach((key) => {
      if (key !== "password") {
        result[key] = user[key];
      }
    });
    return res.json({ status: "success", data: { user: result } });
  } catch (error) {
    const array = req.files as Array<Object>;
    const paths: Array<string> = array?.map((file: any) => file.path) ?? [];
    for (const path of paths) {
      fs.rmSync(path);
    }
    next(error);
  }
};

export const deleteUser = handler(
  async (req: any, res: Response, next: NextFunction) => {
    let user = await Customer.findByIdAndDelete(req.user._id);
    if (user) {
      fs.rmSync(user.photo);
    }
    return res.json({ status: "success", data: { user: null } });
  }
);

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new CustomError(401, "Unauthenticated users."));
    return;
  }

  let payload = verifyToken(token) as JwtPayload;
  const user = await Customer.findById(payload.id);
  if (!user) {
    next(new CustomError(401, "User doesn't exist"));
    return;
  }
  req.user = user;

  next();
};
