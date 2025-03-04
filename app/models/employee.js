'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Employee.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      models.Employee.belongsTo(models.Tenants, {
        foreignKey: "tenant_id",
      });
    }
  }
  Employee.init({
    id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: DataTypes.UUID,
    tenant_id: DataTypes.UUID,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Employee;
};