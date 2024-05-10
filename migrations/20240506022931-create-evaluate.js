"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Evaluates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      scored: {
        type: Sequelize.STRING,
      },
      assist: {
        type: Sequelize.STRING,
      },
      saveGoal: {
        type: Sequelize.STRING,
      },
      ownGoal: {
        type: Sequelize.STRING,
      },
      discipline: {
        type: Sequelize.STRING,
      },
      yellowCard: {
        type: Sequelize.STRING,
      },
      redCard: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Evaluates");
  },
};
