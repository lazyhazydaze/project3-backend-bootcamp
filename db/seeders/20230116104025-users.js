"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        name: "Abigail",
        email: "abigail@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Benjamin",
        email: "benjamin@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Charlie",
        email: "charlie@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Damian",
        email: "damian@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Elaine",
        email: "elaine@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
