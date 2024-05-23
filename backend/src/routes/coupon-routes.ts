import express, { Router } from "express";
import * as controller from ".././controllers/coupon-controllers";
import { protect } from "../controllers/user-controllers";

const router: Router = express.Router();

router.get("/get/:name", controller.getCoupon);
router.get("/get-all", protect, controller.getCoupons);
router.post("/create", protect, controller.createCoupon);
router.patch("/update/:id", protect, controller.updateCoupon);
router.delete("/delete/:id", protect, controller.deleteCoupon);

export default router;
