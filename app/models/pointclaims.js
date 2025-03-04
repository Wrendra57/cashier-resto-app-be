'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PointClaims extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.PointClaims.belongsTo(models.Tenants, {
        foreignKey: "tenant_id",
      });
      models.PointClaims.belongsTo(models.Memberships, {
        foreignKey: "membership_id",
      });
    }
  }
  PointClaims.init({
    id: DataTypes.UUID,
    tenant_id: DataTypes.UUID,
    membership_id: DataTypes.UUID,
    point_used: DataTypes.INTEGER,
    reward: DataTypes.STRING,
    claimed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PointClaims',
    tableName: 'point_claims',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return PointClaims;
};