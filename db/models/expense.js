"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.invoice, { foreignKey: "invoice_id" });
      this.belongsTo(models.user, { as: "payer", foreignKey: "payer_id" });
      this.hasMany(models.splitexpense, {
        as: "expense",
        foreignKey: "expense_id",
      });
    }
  }
  Expense.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      payer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      invoice_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "invoice",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "expense",
      underscored: true,
    }
  );
  return Expense;
};
