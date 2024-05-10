"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MonthyFunds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.INTEGER,
      },
      contributed_list: {
        type: Sequelize.STRING,
      },
      uncontributed_list: {
        type: Sequelize.STRING,
      },
      list_no_need: {
        type: Sequelize.STRING,
      },
      collected: {
        type: Sequelize.FLOAT,
      },
      date: {
        type: Sequelize.STRING,
      },
      groupId: {
        type: Sequelize.INTEGER,
      },
      member_needs_to_pay: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MonthyFunds");
  },
};
