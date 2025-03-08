'use strict';
const {encodedPassword} = require('../../../app/utils/converter/bcrypt')
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await encodedPassword('password');
    return queryInterface.bulkInsert('users', [
      {id:uuidv4(),name:'test',email:'testing_1@test.com',password:password,phone_number:628324524001,is_verified:false},
      {id:uuidv4(),name:'test',email:'testing_2@test.com',password:password,phone_number:628324524002,is_verified:false}

    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
