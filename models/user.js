"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    url: DataTypes.STRING,
    random_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return User;
};
