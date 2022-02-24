const express = require("express");

const router = express.Router();

const user = require("./user.api");
const leave = require("./leave.api");
const overtime = require("./overtime.api");
const report = require("./report.api");

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/user", user);
router.use("/leave", leave);
router.use("/overtime", overtime);
router.use("/report", report);

module.exports = router;
