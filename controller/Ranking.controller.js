const { Ranking } = require("../models");
const createRanking = async (req, res) => {
  const { value, group_id } = req.body;
  try {
    const newRanking = await Ranking.create({
      value,
      group_id,
    });
    res.status(201).send(newRanking);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createRanking };
