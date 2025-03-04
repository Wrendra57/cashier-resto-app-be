'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserRole.belongsTo(models.User, {
        foreignKey: "user_id",
      });

    }
  }
  UserRole.init({
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: DataTypes.UUID,
    role: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},

  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return UserRole;
};