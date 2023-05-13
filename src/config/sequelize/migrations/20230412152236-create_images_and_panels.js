"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      imageData: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    await queryInterface.createTable("solarpanels", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      modelName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      capacity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      length: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      width: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      height: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      producer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      efficiency: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      powerType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("images")
    await queryInterface.dropTable("solarpanels")
  },
}
