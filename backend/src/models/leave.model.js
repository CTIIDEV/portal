module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define("leaves", {
    leaveBegin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    leaveEnds: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    leaveDesc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leaveImage: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    leaveStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Leave;
};
