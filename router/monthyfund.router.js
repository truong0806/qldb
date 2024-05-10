const express = require("express");
const {
  getmMonthlyFund,
  createMonthlyFund,
  editMonthlyFund,
  contributeFunds,
  uncontributeFunds,
  noNeedToContribute,
} = require("../controller/MonthyFund.controller");
const { authenticate } = require("../middlewares/auth/authenticate");
const monthyfundRouter = express.Router();

monthyfundRouter.get("/month", authenticate, getmMonthlyFund);
monthyfundRouter.post("/", authenticate, createMonthlyFund);
monthyfundRouter.put("/", authenticate, editMonthlyFund);
monthyfundRouter.post("/contribute", authenticate, contributeFunds);
monthyfundRouter.post("/uncontribute", authenticate, uncontributeFunds);
monthyfundRouter.post("/unnoneed", authenticate, noNeedToContribute);

module.exports = { monthyfundRouter };
