'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tenants.hasMany(models.Employee,{
        foreignKey: "tenant_id",
      })
      Tenants.hasMany(models.Memberships,{
        foreignKey: "tenant_id",
      })
      Tenants.hasMany(models.PointClaims,{
        foreignKey: "tenant_id",
      })
    }
  }
  Tenants.init({
    id: {type:DataTypes.UUID, primaryKey:true, defaultValue:DataTypes.UUIDV4},
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull:true},
  }, {
    sequelize,
    modelName: 'Tenants',
    tableName: 'tenants',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Tenants;
};