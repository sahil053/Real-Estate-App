import Express from "express";

import {
  createUsers,
  getAllUsers,
  getUserInfoByID,
} from "../controllers/user.controller.js";

const router = Express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUsers);
router.route("/:id").get(getUserInfoByID);

export default router;
