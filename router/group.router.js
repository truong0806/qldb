const express = require("express");
const { createGroup, updateGroup,deleteGroup,getName } = require("../controller/Group.controller");

const groupRouter = express.Router();

groupRouter.post("/", createGroup);
groupRouter.get("/", getName);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

module.exports = { groupRouter };
