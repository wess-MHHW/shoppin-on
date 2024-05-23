import { Router } from "express";

import { protect } from "../controllers/user-controllers";

import * as controller from "../controllers/order-controllers";

const router: Router = Router();

router.get("/get-stats", controller.getOrderStats);
router.get("/get/:id", controller.getOrder);
router.get("/get-all/:phone", controller.getOrders);
router.get("/filter", controller.filterOrders);
router.post("/create", controller.createOrder);
router.post("/cancel/:id", controller.cancelOrder);
router.patch("/update/:id", protect, controller.updateOrder);

export default router;
