import { Router } from "express";
import { randomUUID } from "crypto";
import multer from "multer";

import * as controller from "../controllers/user-controllers";
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

const upload = multer({ storage: storage });

const router: Router = Router();

router.get("/get-all", controller.getUsers);
router.post("/create", upload.any(), controller.createUser);
router.post("/login", controller.login);
router.post(
  "/update/:id",
  controller.protect,
  upload.any(),
  controller.updateUser
);
router.delete("/delete", controller.protect, controller.deleteUser);

export default router;
