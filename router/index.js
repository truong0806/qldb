const express = require("express");
const { userRouter } = require("./user.router");
const { groupRouter } = require("./group.router");
const { memberRouter } = require("./member.router");
const { resultRouter } = require("./result.router");
const { authenticate } = require("../middlewares/auth/authenticate");
const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/members", memberRouter);
rootRouter.use("/groups",authenticate, groupRouter);
rootRouter.use("/results", resultRouter);

module.exports = { rootRouter };
