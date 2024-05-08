const express = require("express");
const { createResult } = require("../controller/Result.controller");

const resultRouter = express.Router();

resultRouter.post("/", createResult);



module.exports = { resultRouter };
