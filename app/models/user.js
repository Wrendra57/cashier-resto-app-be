'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserRole,{
        foreignKey: "user_id",
      })
      User.hasMany(models.Employee,{
        foreignKey: "user_id",
      })
      User.hasMany(models.Memberships,{
        foreignKey: "admin_id",
      })
    }
  }
  User.init({
    id: {type:DataTypes.UUID, primaryKey:true},
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'

  });
  return User;
};