module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("reports", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportProductClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportYearPrev: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reportYearCurr: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  return Report;
};
