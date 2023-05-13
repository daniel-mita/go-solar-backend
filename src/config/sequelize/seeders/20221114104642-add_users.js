"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        username: "Daniel",
        password:
          "$2a$12$jgQF6fIOwU0oxq00H.ygXe1Kl.mcuIOeWh4jy6hy.krMqWXbOby3q",
        email: "mitadanyel@gmail.com",
        avatarSeed: "Shadow",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {})
  },
}
