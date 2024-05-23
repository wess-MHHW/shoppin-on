import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./routes/user-routes";
import categoryRouter from "./routes/category-routes";
import productRouter from "./routes/product-routes";
import orderRouter from "./routes/order-routes";
import couponRouter from "./routes/coupon-routes";

const app: Express = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/images/", express.static("images"));

app.use("/user", userRouter);
app.use("/coupon", couponRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send({ status: "faliure", message: error.message });
});

export default app;
