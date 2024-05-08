'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Group}) {
      // define association here
      this.belongsTo(Group, { foreignKey: "group_id" });

    }
  }
  Result.init({
    goal:DataTypes.INTEGER,
    lost:DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    date:DataTypes.DATE,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};