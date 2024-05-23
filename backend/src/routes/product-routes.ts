import { Router } from "express";
import * as controller from "../controllers/product-controllers";

import multer from "multer";
import { protect } from "../controllers/user-controllers";
import { randomUUID } from "crypto";
import CustomError from "../utils/classes/custom-error";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const whitelist = ["image/png", "image/jpeg", "image/jpg"];
    if (!whitelist.includes(file.mimetype)) {
      return cb(new CustomError(400, "file is not allowed"), "");
    }
    cb(null, randomUUID() + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage }).array("files", 5);

const router: Router = Router();

router.get("/get-best-sellers", controller.getBestSellers);
router.get("/filter", controller.filterProducts);
router.post("/create", protect, upload, controller.createPorduct);
router.post("/update/:id", protect, upload, controller.updatePorduct);
router.delete("/delete/:id", protect, controller.deleteProduct);

export default router;
