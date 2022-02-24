const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/yseraaaa")(sequelize, Sequelize);
db.leave = require("../models/leave.model")(sequelize, Sequelize);
db.overtime = require("../models/overtime.model")(sequelize, Sequelize);
db.report = require("../models/report.model")(sequelize, Sequelize);

db.sequelize
  .sync({
    // force: true
  })
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    // console.log(err);
  });

db.user.hasMany(db.leave, {
  onDelete: "cascade",
  onUpdate: "cascade",
  as: "leaves",
  foreignKey: {
    allowNull: false,
    name: "userId",
  },
});

db.leave.belongsTo(db.user, {
  as: "users",
  foreignKey: {
    allowNull: false,
    name: "userId",
  },
});

db.user.hasMany(db.overtime, {
  onDelete: "cascade",
  onUpdate: "cascade",
  as: "overtimes",
  foreignKey: {
    allowNull: false,
    name: "userId",
  },
});

db.overtime.belongsTo(db.user, {
  as: "users",
  foreignKey: {
    allowNull: false,
    name: "userId",
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = db;
