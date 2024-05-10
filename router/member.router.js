const express = require("express");
const {
  createMember,
  updateMember,
  deleteMember,
  getAllMember,
} = require("../controller/Member.controller");
const { authenticate } = require("../middlewares/auth/authenticate");

const memberRouter = express.Router();

memberRouter.post("/", authenticate, createMember);
memberRouter.get("/", getAllMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", deleteMember);

module.exports = { memberRouter };
