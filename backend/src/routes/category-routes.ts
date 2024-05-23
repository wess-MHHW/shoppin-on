import { Router } from "express";

import * as controller from "../controllers/category-controllers";
import { protect } from "../controllers/user-controllers";
import multer from "multer";
import CustomError from "../utils/classes/custom-error";
import { randomUUID } from "crypto";
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

const upload = multer({ storage: storage });

const router: Router = Router();

router.get("/get/:id", controller.getCategory);
router.get("/get-all", controller.getCategories);
router.post("/create", protect, upload.any(), controller.createCategory);
router.patch("/update/:id", protect, upload.any(), controller.updateCategory);
router.delete("/delete/:id", protect, controller.deleteCategory);

export default router;
