import { Request, Response, NextFunction } from "express";

export default function handler(func: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error: Error) => {
      next(error);
    });
  };
}
