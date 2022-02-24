module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("usersaa", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userLoginName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userGender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userDateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userPosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};
