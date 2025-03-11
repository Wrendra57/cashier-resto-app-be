'use strict';
const {encodedPassword} = require('../../../app/utils/converter/bcrypt')
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await encodedPassword('password');
    return queryInterface.bulkInsert('users', [
      {id:uuidv4(),name:'test',email:'testing_1@test.com',password:password,phone_number:"628324524001",is_verified:false},
      {id:uuidv4(),name:'test',email:'testing_2@test.com',password:password,phone_number:"628324524002",is_verified:false},
      {id:'994c46f0-0816-413c-904b-298bfa8d3eec',name:'test_login',email:'testing_login_1@test.com',password:password,phone_number:"628324524003",is_verified:true},
      {id:'fe62ec97-d746-4316-ae86-6919d15fb8be',name:'test_login',email:'testing_login_2@test.com',password:password,phone_number:"628324524004",is_verified:true},
      {id:'68902386-fb81-4612-a0e5-e1540fa685ea',name:'test_login',email:'testing_login_3@test.com',password:password,phone_number:"628324524005",is_verified:false},
      {id:'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',name:'test_auth_me',email:'authme_testing_1@test.com',password:password,phone_number:"628324524006",is_verified:true},
      {id:'c0f2db86-88b9-43a7-bc65-0a0e2be8a26b',name:'test_auth_me',email:'authme_testing_2@test.com',password:password,phone_number:"628324524007",is_verified:true},
      {id:'68398dfb-1258-4ba4-ac8f-da5093a3b491',name:'test_find_by_id',email:'findbyid_testing_1@test.com',password:password,phone_number:"628324524008",is_verified:true},
      {id:'480b1d66-8c1b-4891-9415-c4218a62abad',name:'test_verify',email:'verify_testing_1@test.com',password:password,phone_number:"628324524009",is_verified:false},
      {id:'b155d3d3-6ee2-4139-aa2d-c22aa85903dc',name:'superadmin',email:'superadmin_testing_1@test.com',password:password,phone_number:"628324524010",is_verified:true},
      {id:'fb728f79-ce38-4857-9595-7abb152603cf',name:'admin',email:'admin_change_role@test.com',password:password,phone_number:"628324524011",is_verified:true},
      {id:'4fc3a798-0818-41a0-80c9-3fb902021375',name:'user',email:'user_change_role@test.com',password:password,phone_number:"628324524012",is_verified:true},


    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
