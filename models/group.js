"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Member,Result,Ranking}) {
      // define association here
      this.hasMany(Member, { foreignKey: "group_id"});
      this.hasMany(Result, { foreignKey: "group_id"});
      this.hasMany(Ranking, { foreignKey: "group_id"});

    }
  }
  Group.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      avatar: DataTypes.STRING,
      country: DataTypes.STRING,
      district: DataTypes.STRING,
      balance: DataTypes.FLOAT,
      ranking: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
