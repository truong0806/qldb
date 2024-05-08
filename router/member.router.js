const express = require("express");
const { createMember,updateMember,deleteMember,getAllMember } = require("../controller/Member.controller");

const memberRouter = express.Router();

memberRouter.post("/", createMember);
memberRouter.get("/", getAllMember);
memberRouter.put("/:id", updateMember);
memberRouter.delete("/:id", deleteMember);


module.exports = { memberRouter };
