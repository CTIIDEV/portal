const express = require("express");
const pdf = require("html-pdf");
const router = express.Router();

const db = require("../database");
const Report = db.report;

const { validateToken } = require("./auth");

const pdfTemplate = require("../template/index");

router.post("/upload", (req, res) => {
  let data = req.body;
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    Report.create({
      userId: data[i].userId,
      userName: data[i].userName,
      reportProductClass: data[i].reportProductClass,
      reportYearPrev: data[i].reportYearPrev,
      reportYearCurr: data[i].reportYearCurr,
    })
      .then((result) => {
        const message = "Data successfully uploaded.";
        res.json({ message });
      })
      .catch((error) => {
        const message = "Failed to request leave. Please try again later.";
        res.status(500).json({ error, message });
      });
  }
});

router.get("/get-reports", async (req, res) => {
  await Report.findAll()
    .then((result) => {
      // console.log(result);
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/get-report/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Report.findAll({
    where: { userId: id },
  });
  if (result) {
    res.json(result);
  } else {
    const message = "Failed to retrieve data. Please try again.";
    res.status(500).json({ message });
  }
});

router.post("/create-report", (req, res) => {
  let data = req.body;
  pdf.create(pdfTemplate(data), {}).toFile("./src/api/result.pdf", (err) => {
    if (err) {
      return console.log("FAILED CREATING REPORT!");
    }
    res.send(Promise.resolve());
  });
});

router.get("/download-report", (req, res) => {
  // console.log(`${__dirname}`);
  res.sendFile("result.pdf", { root: __dirname });
});

router.delete("/delete-reports", (req, res) => {
  Report.destroy({
    where: {},
    truncate: false,
  })
    .then((num) => {
      console.log(num);
      if (num == 0) {
        const message = "Failed to delete reports.";
        res.status(401).json({ message });
      } else {
        const message = "Success to delete reports. Please refresh page.";
        res.json({ message });
      }
    })
    .catch((error) => {
      const message = "Failed to delete reports. Try again later.";
      res.status(500).json({ error, message });
    });
});

module.exports = router;
