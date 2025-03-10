'use strict';
const {encodedPassword} = require('../../../app/utils/converter/bcrypt')
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await encodedPassword('password');
    return queryInterface.bulkInsert('users', [
      {id:uuidv4(),name:'test',email:'testing_1@test.com',password:password,phone_number:"628324524001",is_verified:false},
      {id:uuidv4(),name:'test',email:'testing_2@test.com',password:password,phone_number:"628324524002",is_verified:false},
      {id:'994c46f0-0816-413c-904b-298bfa8d3eec',name:'test_login',email:'testing_login_1@test.com',password:password,phone_number:"628324524003",is_verified:false},
      {id:'fe62ec97-d746-4316-ae86-6919d15fb8be',name:'test_login',email:'testing_login_2@test.com',password:password,phone_number:"628324524004",is_verified:false}

    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
