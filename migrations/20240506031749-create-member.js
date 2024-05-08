'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullname: 
      {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      tshift: {
        type: Sequelize.FLOAT
      },
      group_id:{
        type:Sequelize.INTEGER,
        references: {
          model: "groups",
          key: "id",
        },
      },
      position: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
  }
};