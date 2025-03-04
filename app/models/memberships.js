'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Memberships extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Memberships.belongsTo(models.Tenants, {
        foreignKey: "tenant_id",
      });
      models.Memberships.belongsTo(models.User, {
        foreignKey: "admin_id",
      });
      Memberships.hasMany(models.PointClaims,{
        foreignKey: "membership_id",
      })
    }
  }
  Memberships.init({
    id: {type:DataTypes.UUID, primaryKey:true},
    tenant_id: DataTypes.UUID,
    admin_id: DataTypes.UUID,
    phone_number: DataTypes.STRING,
    points: DataTypes.INTEGER,
    tier: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'Memberships',
    tableName: 'users',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Memberships;
};