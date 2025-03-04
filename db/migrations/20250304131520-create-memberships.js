'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('memberships', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        }
      },
      admin_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tier: {
        type: Sequelize.ENUM('bronze', 'silver', 'gold'),
        allowNull: false,
        defaultValue: 'bronze',
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
    await queryInterface.dropTable('memberships');
  }
};