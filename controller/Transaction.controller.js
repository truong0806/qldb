const { Transaction, Group, sequelize } = require("../models");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const convertDateFormat = require("../ultils/convertDate");
const getAllTransaction = async (req, res) => {
  try {
    const result = await Transaction.findAll();
    console.log("🚀 ~ getAllTransaction ~ result:", result);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getTransactionByMonth = async (req, res) => {
  try {
    const month = parseInt(req.query.m);
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    const results = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    results.forEach((transaction) => {
      transaction.createdAt = moment
        .utc(transaction.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY HH:mm:ss");
    });

    const sumByType = results.reduce(
      (acc, transaction) => {
        if (transaction.type === 1) {
          acc.income += transaction.value;
        } else if (transaction.type === 2) {
          acc.expense += transaction.value;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
    const separatedTransactions = {
      income: results.filter((transaction) => transaction.type === 1),
      expense: results.filter((transaction) => transaction.type === 2),
    };

    res.json({
      count: results.length,
      sumByType,
      data: separatedTransactions,
    });
  } catch (error) {
    console.error("Error querying results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getTransactionByDay = async (req, res) => {
  try {
    const year = parseInt(req.query.y);
    const month = parseInt(req.query.m);
    const day = parseInt(req.query.d);

    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    const results = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const sumByType = results.reduce(
      (acc, transaction) => {
        if (transaction.type === 1) {
          acc.income += transaction.value;
        } else if (transaction.type === 2) {
          acc.expense += transaction.value;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const separatedTransactions = {
      income: results.filter((transaction) => transaction.type === 1),
      expense: results.filter((transaction) => transaction.type === 2),
    };

    res.json({
      count: results.length,
      sumByType,
      data: separatedTransactions,
    });
  } catch (error) {
    console.error("Error querying results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID must be a number" });
    }
    console.log("🚀 ~ getTransactionById ~ id:", id);
    const result = await Transaction.findOne({
      where: {
        id,
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Error querying results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getFundBalance = async (req, res) => {
  try {
    const result = await Group.findAll({
      attributes: ["balance"],
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTransaction = async (req, res) => {
  const { type, content, value, note, date } = req.body;
  const userId = req.user.id;
  try {
    if (type !== 1 && type !== 2) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    let transactionDate = date ? moment.tz(date, "UTC") : moment().tz("UTC");
    transactionDate = transactionDate.tz("Asia/Ho_Chi_Minh");
    const formattedDate = transactionDate.format("YYYY-MM-DD HH:mm:ss");

    const newTransaction = await Transaction.create({
      type,
      content,
      value,
      note,
      createdAt: formattedDate,
    });
    const amount = type === 1 ? value : -value;
    const [updatedRows] = await Group.update(
      { balance: sequelize.literal(`balance + ${amount}`) },
      { where: { userId: userId } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Group not found or not updated" });
    }
    res.status(201).send(newTransaction);
  } catch (error) {
    console.log("🚀 ~ createTransaction ~ error:", error);
    res.status(500).send(error);
  }
};
const deleteTransaction = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction || transaction.type === 3) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    const result = await Transaction.destroy({ where: { id } });
    res.status(200).json({ statuscode: 200, message: "Delete complete" });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  getAllTransaction,
  createTransaction,
  getTransactionByMonth,
  getTransactionById,
  getFundBalance,
  getTransactionByDay,
  deleteTransaction,
};
