'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sermon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sermon.init({
    title: DataTypes.STRING,
    preacher: DataTypes.STRING,
    audioUrl: DataTypes.STRING,
    thumbnailUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sermon',
  });
  return Sermon;
};