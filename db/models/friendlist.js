"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { as: "user1", foreignKey: "user1_id" });
      this.belongsTo(models.user, {
        as: "user2",
        foreignKey: "user2_id",
      });
    }
  }
  FriendList.init(
    {
      user1_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      user2_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "friendlist",
      underscored: true,
    }
  );
  return FriendList;
};
