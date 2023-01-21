"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.group, {
        through: "group_users",
      });
      this.hasMany(models.invoice, { foreignKey: "author_id" });
      this.hasMany(models.expense, { foreignKey: "payer_id" });
      this.hasMany(models.splitexpense, {
        as: "splitby",
        foreignKey: "split_by_id",
      });
      this.hasMany(models.splitexpense, {
        as: "paidby",
        foreignKey: "paid_by_id",
      });
      this.hasMany(models.friendrequest, {
        as: "sender",
        foreignKey: "sender_id",
      });
      this.hasMany(models.friendrequest, {
        as: "recipient",
        foreignKey: "recipient_id",
      });
      this.hasMany(models.friendlist, { as: "user1", foreignKey: "user1_id" });
      this.hasMany(models.friendlist, {
        as: "user2",
        foreignKey: "user2_id",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};
