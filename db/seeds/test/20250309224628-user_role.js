'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_role', [
      {user_id:'994c46f0-0816-413c-904b-298bfa8d3eec', role:'user'},
      {user_id:'68902386-fb81-4612-a0e5-e1540fa685ea', role:'user'}
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_role', null, {});
  }
};
