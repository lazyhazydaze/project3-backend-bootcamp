"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.user, {
        through: "group_users",
      });
      this.hasMany(models.invoice, { as: "invoices", foreignKey: "invoice_group_id" });
    }
  }
  Group.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "group",
      underscored: true,
    }
  );
  return Group;
};
