"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Evaluate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {}
  }
  Evaluate.init(
    {
      date: DataTypes.STRING,
      scored: DataTypes.STRING,
      assist: DataTypes.STRING,
      saveGoal: DataTypes.STRING,
      ownGoal: DataTypes.STRING,
      discipline: DataTypes.STRING,
      yellowCard: DataTypes.STRING,
      redCard: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Evaluate",
    }
  );
  return Evaluate;
};
