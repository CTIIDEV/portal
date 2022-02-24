module.exports = (sequelize, DataTypes) => {
  const Overtime = sequelize.define("overtimes", {
    overtimeDateReq: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    overtimeBegin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overtimeEnds: {
      type: DataTypes.STRING,
      allowNull: false
    },
    overtimeDesc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    overtimeStatus: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Overtime;
}