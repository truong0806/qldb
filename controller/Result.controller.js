const { Result } = require("../models");
const createResult = async (req, res) => {
  const { goal, lost, type, date, notes, group_id } = req.body;
  try {
    const newResult = await Result.create({
      goal,
      lost,
      type,
      date,
      notes,
      group_id,
    });
    res.status(201).send(newResult);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createResult };
