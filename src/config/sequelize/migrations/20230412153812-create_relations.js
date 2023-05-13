"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("images", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "SET NULL",
      onDelete: "SET NULL",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("images", "userId")
  },
}
