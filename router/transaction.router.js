const express = require("express");
const {
  getAllTransaction,
  createTransaction,
  getTransactionByMonth,
  getTransactionById,
  getFundBalance,
  getTransactionByDay,
  deleteTransaction,
} = require("../controller/Transaction.controller");
const { authenticate } = require("../middlewares/auth/authenticate");

const transactionFundRouter = express.Router();

transactionFundRouter.get("/all", getAllTransaction);
transactionFundRouter.get("/month", getTransactionByMonth);
transactionFundRouter.get("/day", getTransactionByDay);
transactionFundRouter.get("/id/:id", getTransactionById);
transactionFundRouter.get("/balance", getFundBalance);
transactionFundRouter.post("/", authenticate, createTransaction);
transactionFundRouter.delete("/:id", authenticate, deleteTransaction);

module.exports = { transactionFundRouter };
