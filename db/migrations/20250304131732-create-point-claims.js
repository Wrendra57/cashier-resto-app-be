'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('point_claims', {
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
      membership_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'memberships',
          key: 'id',
        }
      },
      point_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reward: {
        type: Sequelize.STRING
      },
      claimed_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('point_claims');
  }
};