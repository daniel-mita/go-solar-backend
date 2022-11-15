"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "Daniel",
        password: "$2a$12$jgQF6fIOwU0oxq00H.ygXe1Kl.mcuIOeWh4jy6hy.krMqWXbOby3q",
        email: "mitadanyel@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
