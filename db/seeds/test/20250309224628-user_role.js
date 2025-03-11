'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_role', [
      {user_id:'994c46f0-0816-413c-904b-298bfa8d3eec', role:'user'},
      {user_id:'68902386-fb81-4612-a0e5-e1540fa685ea', role:'user'},
      {user_id:'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b', role:'user'},
      {user_id:'68398dfb-1258-4ba4-ac8f-da5093a3b491', role:'user'},
      {user_id:'68398dfb-1258-4ba4-ac8f-da5093a3b491', role:'admin'},
      {user_id:'68398dfb-1258-4ba4-ac8f-da5093a3b491', role:'superadmin'},
      {user_id:'480b1d66-8c1b-4891-9415-c4218a62abad', role:'user'},
      {user_id:'b155d3d3-6ee2-4139-aa2d-c22aa85903dc', role:'user'},
      {user_id:'b155d3d3-6ee2-4139-aa2d-c22aa85903dc', role:'admin'},
      {user_id:'b155d3d3-6ee2-4139-aa2d-c22aa85903dc', role:'superadmin'},
      {user_id:'fb728f79-ce38-4857-9595-7abb152603cf', role:'user'},
      {user_id:'fb728f79-ce38-4857-9595-7abb152603cf', role:'admin'},
      {user_id:'4fc3a798-0818-41a0-80c9-3fb902021375', role:'user'},
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_role', null, {});
  }
};
