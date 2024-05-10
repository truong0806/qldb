const express = require("express");
const { userRouter } = require("./user.router");
const { groupRouter } = require("./group.router");
const { memberRouter } = require("./member.router");
const { resultRouter } = require("./result.router");
const { monthyfundRouter } = require("./monthyfund.router");
const { transactionFundRouter } = require("./transaction.router");
const { evaluateRouter } = require("./evaluate.router");
const { authenticate } = require("../middlewares/auth/authenticate");
const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/members", memberRouter);
rootRouter.use("/groups", groupRouter);
rootRouter.use("/results", resultRouter);
rootRouter.use("/monthyfund", monthyfundRouter);
rootRouter.use("/transaction-fund", transactionFundRouter);
rootRouter.use("/evaluate", evaluateRouter);
rootRouter.use((req, res, next) => {
  return res.status(404).send({
    status: 404,
    message: "Not found",
  });
});

module.exports = { rootRouter };
