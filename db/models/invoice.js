"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { as: "author", foreignKey: "author_id" });
      this.belongsTo(models.group, { as: "group", foreignKey: "invoice_group_id" });
      this.hasMany(models.expense, { as: "expenses", foreignKey: "invoice_id" });
    }
  }
  Invoice.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      invoice_group_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "group",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "invoice",
      underscored: true,
    }
  );
  return Invoice;
};
