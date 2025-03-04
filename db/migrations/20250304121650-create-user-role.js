'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      role: {
        type: Sequelize.ENUM('superadmin', 'admin', 'user'),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        field: 'created_at',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        onUpdate : Sequelize.literal('NOW()'),
        field: 'updated_at',
      },
      deleted_at:{
        allowNull: true,
        type: Sequelize.DATE,
        field: 'deleted_at',

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_role');
  }
};