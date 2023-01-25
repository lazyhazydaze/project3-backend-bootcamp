"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SplitExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.expense, { foreignKey: "expense_id" });
      this.belongsTo(models.user, { as: "splitby", foreignKey: "split_by_id" });
      this.belongsTo(models.user, { as: "paidby", foreignKey: "paid_by_id" });
    }
  }
  SplitExpense.init(
    {
      expense_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "expense",
          key: "id",
        },
      },
      split_by_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      paid_by_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "splitexpense",
      underscored: true,
    }
  );
  return SplitExpense;
};
