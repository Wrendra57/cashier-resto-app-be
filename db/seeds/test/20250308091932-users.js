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
      {id:'68398dfb-1258-4ba4-ac8f-da5093a3b491',name:'test_find_by_id',email:'findbyid_testing_1@test.com',password:password,phone_number:"628324524008",is_verified:true}


    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
