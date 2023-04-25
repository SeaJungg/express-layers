const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: "User_email_key"
    },
    oauth_id: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: "User_oauth_id_key"
    },
    oauth_provider: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'User',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "User_email_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "User_oauth_id_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "oauth_id" },
        ]
      },
    ]
  });
};
