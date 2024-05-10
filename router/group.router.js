const express = require("express");
const { createGroup, updateGroup,deleteGroup,getName } = require("../controller/Group.controller");
const { authenticate } = require("../middlewares/auth/authenticate");

const groupRouter = express.Router();

groupRouter.post("/",authenticate, createGroup);
groupRouter.get("/", getName);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

module.exports = { groupRouter };
