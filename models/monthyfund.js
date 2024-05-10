"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MonthyFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MonthyFund.init(
    {
      groupId: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      contributed_list: DataTypes.STRING,
      uncontributed_list: DataTypes.STRING,
      list_no_need: DataTypes.STRING,
      collected: DataTypes.FLOAT,
      date: DataTypes.STRING,
      member_needs_to_pay: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "MonthyFund",
    }
  );
  return MonthyFund;
};
