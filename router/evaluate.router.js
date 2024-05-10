const express = require("express");
const {
  createEvaluate,
  getEvaluateByDay,
} = require("../controller/Evaluate.controller");
const { authenticate } = require("../middlewares/auth/authenticate");

const evaluateRouter = express.Router();

evaluateRouter.post("/", authenticate, createEvaluate);
evaluateRouter.get("/", authenticate, getEvaluateByDay);

module.exports = { evaluateRouter };
