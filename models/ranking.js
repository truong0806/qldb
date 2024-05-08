'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ranking extends Model {
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
  Ranking.init({
    value: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Ranking',
  });
  return Ranking;
};